import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { forwardAuthRequest } from "./auth-proxy";

describe("Auth same-origin proxy", () => {
  beforeEach(() => {
    vi.stubEnv("MUCYORA_AUTH_API_ORIGIN", "http://127.0.0.1:3000");
    vi.stubEnv("MUCYORA_AUTH_PROXY_TIMEOUT_MS", "30000");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("forwards an allowlisted request to the private Auth origin", async () => {
    const payload = JSON.stringify({ email: "aline.uwase@example.rw" });
    const backendPayload = JSON.stringify({
      code: "EMAIL_VERIFICATION_REQUIRED",
      message: "Verify your email address before continuing.",
    });
    const backendHeaders = new Headers({
      "content-type": "application/json; charset=utf-8",
      "retry-after": "60",
      "set-cookie":
        "mucyora_refresh=opaque; Domain=localhost; Path=/api/v1/auth; HttpOnly; SameSite=Lax",
      "x-correlation-id": "correlation-kigali-0001",
    });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(backendPayload, {
        status: 409,
        headers: backendHeaders,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await forwardAuthRequest(
      new Request("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": "registration-kigali-0001",
          origin: "http://localhost:4000",
          "x-client-instance-id": "browser-kigali-0001",
        },
        body: payload,
      }),
      "POST",
      ["auth", "login"],
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.toString()).toBe("http://127.0.0.1:3000/api/v1/auth/login");
    expect(init).toMatchObject({
      method: "POST",
      cache: "no-store",
      credentials: "omit",
      redirect: "manual",
    });
    expect(new Headers(init.headers).get("idempotency-key")).toBe(
      "registration-kigali-0001",
    );
    expect(new TextDecoder().decode(init.body as ArrayBuffer)).toBe(payload);
    expect(response.status).toBe(409);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(response.headers.get("retry-after")).toBe("60");
    expect(response.headers.get("x-correlation-id")).toBe(
      "correlation-kigali-0001",
    );
    expect(response.headers.get("set-cookie")).toContain("Path=/auth");
    expect(response.headers.get("set-cookie")).not.toContain("Domain=");
    expect(await response.text()).toBe(backendPayload);
  });

  it("returns no frontend-authored message when Auth is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const response = await forwardAuthRequest(
      new Request("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { origin: "http://localhost:4000" },
      }),
      "POST",
      ["auth", "login"],
    );

    expect(response.status).toBe(502);
    expect(await response.text()).toBe("");
  });

  it("rejects cross-site forwarding before contacting Auth", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await forwardAuthRequest(
      new Request("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          origin: "https://attacker.example",
          "sec-fetch-site": "cross-site",
        },
      }),
      "POST",
      ["auth", "login"],
    );

    expect(response.status).toBe(403);
    expect(await response.text()).toBe("");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies before contacting Auth", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await forwardAuthRequest(
      new Request("http://localhost:4000/registration", {
        method: "POST",
        headers: {
          "content-length": String(256 * 1024 + 1),
          origin: "http://localhost:4000",
        },
        body: "{}",
      }),
      "POST",
      ["registration"],
    );

    expect(response.status).toBe(413);
    expect(await response.text()).toBe("");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unsafe upstream origins and path traversal", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("MUCYORA_AUTH_API_ORIGIN", "http://backend.example:3000");

    const invalidOriginResponse = await forwardAuthRequest(
      new Request("http://localhost:4000/auth/login", { method: "POST" }),
      "POST",
      ["auth", "login"],
    );
    expect(invalidOriginResponse.status).toBe(500);

    vi.stubEnv("MUCYORA_AUTH_API_ORIGIN", "http://127.0.0.1:3000");
    const traversalResponse = await forwardAuthRequest(
      new Request("http://localhost:4000/auth/sessions/unsafe", {
        method: "DELETE",
      }),
      "DELETE",
      ["auth", "sessions", ".."],
    );
    expect(traversalResponse.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
