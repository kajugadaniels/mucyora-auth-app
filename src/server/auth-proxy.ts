const API_PREFIX = ["api", "v1"] as const;
const MAX_REQUEST_BODY_BYTES = 256 * 1024;
const DEFAULT_TIMEOUT_MS = 30_000;
const MIN_TIMEOUT_MS = 1_000;
const MAX_TIMEOUT_MS = 120_000;

const REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "cookie",
  "idempotency-key",
  "user-agent",
  "x-client-instance-id",
  "x-correlation-id",
  "x-csrf-token",
] as const;

const RESPONSE_HEADERS = [
  "cache-control",
  "content-language",
  "content-type",
  "expires",
  "pragma",
  "retry-after",
  "vary",
  "www-authenticate",
  "x-correlation-id",
  "x-request-id",
] as const;

type ProxyMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export async function forwardAuthRequest(
  request: Request,
  method: ProxyMethod,
  endpointSegments: readonly string[],
): Promise<Response> {
  if (request.method !== method) {
    return emptyResponse(405, { allow: method });
  }

  if (!isSameOriginRequest(request)) {
    return emptyResponse(403);
  }

  const body = await readBoundedBody(request, method);
  if (body instanceof Response) {
    return body;
  }

  let upstreamUrl: URL;
  let timeoutMs: number;

  try {
    upstreamUrl = buildUpstreamUrl(endpointSegments);
    timeoutMs = readTimeoutMs();
  } catch {
    return emptyResponse(500);
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const signal = AbortSignal.any([request.signal, timeoutSignal]);

  try {
    const upstream = await fetch(upstreamUrl, {
      method,
      headers: copyRequestHeaders(request.headers),
      body,
      cache: "no-store",
      credentials: "omit",
      redirect: "manual",
      signal,
    });

    return copyUpstreamResponse(upstream);
  } catch (error) {
    if (isAbortError(error) && timeoutSignal.aborted) {
      return emptyResponse(504);
    }

    return emptyResponse(502);
  }
}

function buildUpstreamUrl(endpointSegments: readonly string[]): URL {
  const origin = readAuthApiOrigin();
  const pathname = [...API_PREFIX, ...endpointSegments]
    .map(encodePathSegment)
    .join("/");

  return new URL(`/${pathname}`, origin);
}

function readAuthApiOrigin(): URL {
  const configured = process.env.MUCYORA_AUTH_API_ORIGIN?.trim();
  if (!configured) {
    throw new Error("MUCYORA_AUTH_API_ORIGIN is required");
  }

  const origin = new URL(configured);
  const isLoopback = ["127.0.0.1", "::1", "localhost"].includes(
    origin.hostname,
  );

  if (
    !["http:", "https:"].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    (origin.pathname !== "/" && origin.pathname !== "") ||
    (origin.protocol !== "https:" && !isLoopback)
  ) {
    throw new Error("MUCYORA_AUTH_API_ORIGIN is invalid");
  }

  return origin;
}

function readTimeoutMs(): number {
  const configured = process.env.MUCYORA_AUTH_PROXY_TIMEOUT_MS?.trim();
  if (!configured) {
    return DEFAULT_TIMEOUT_MS;
  }

  const timeoutMs = Number(configured);
  if (
    !Number.isInteger(timeoutMs) ||
    timeoutMs < MIN_TIMEOUT_MS ||
    timeoutMs > MAX_TIMEOUT_MS
  ) {
    throw new Error("MUCYORA_AUTH_PROXY_TIMEOUT_MS is invalid");
  }

  return timeoutMs;
}

function encodePathSegment(segment: string): string {
  if (
    !segment ||
    segment === "." ||
    segment === ".." ||
    segment.includes("/") ||
    segment.includes("\\") ||
    segment.length > 512
  ) {
    throw new Error("Invalid Auth proxy path segment");
  }

  return encodeURIComponent(segment);
}

function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readBoundedBody(
  request: Request,
  method: ProxyMethod,
): Promise<ArrayBuffer | undefined | Response> {
  if (method === "GET") {
    return undefined;
  }

  const declaredLength = request.headers.get("content-length");
  if (
    declaredLength &&
    (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_REQUEST_BODY_BYTES)
  ) {
    return emptyResponse(413);
  }

  try {
    const body = await request.arrayBuffer();
    if (body.byteLength > MAX_REQUEST_BODY_BYTES) {
      return emptyResponse(413);
    }
    return body.byteLength === 0 ? undefined : body;
  } catch {
    return emptyResponse(400);
  }
}

function copyRequestHeaders(source: Headers): Headers {
  const headers = new Headers();
  for (const name of REQUEST_HEADERS) {
    const value = source.get(name);
    if (value !== null) {
      headers.set(name, value);
    }
  }
  return headers;
}

function copyUpstreamResponse(upstream: Response): Response {
  const headers = new Headers();
  for (const name of RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value !== null) {
      headers.set(name, value);
    }
  }

  headers.set("cache-control", "no-store");
  for (const cookie of readSetCookies(upstream.headers)) {
    headers.append("set-cookie", scopeCookieToFrontend(cookie));
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

function readSetCookies(headers: Headers): string[] {
  const cookies = headers.getSetCookie();
  if (cookies.length > 0) {
    return cookies;
  }

  const cookie = headers.get("set-cookie");
  return cookie ? [cookie] : [];
}

function scopeCookieToFrontend(cookie: string): string {
  const withoutDomain = cookie.replace(/;\s*Domain=[^;]*/gi, "");
  const frontendPath = /;\s*HttpOnly(?:;|$)/i.test(withoutDomain)
    ? "/auth"
    : "/";
  if (/;\s*Path=/i.test(withoutDomain)) {
    return withoutDomain.replace(
      /;\s*Path=[^;]*/i,
      `; Path=${frontendPath}`,
    );
  }
  return `${withoutDomain}; Path=${frontendPath}`;
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    ["AbortError", "TimeoutError"].includes(error.name)
  );
}

function emptyResponse(
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(null, {
    status,
    headers: {
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}
