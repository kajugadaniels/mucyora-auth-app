import type {
  AuthTokenResult,
  DocumentCaptureSession,
  LivenessSession,
  VerificationSubmission,
} from "./auth.types";

interface FlowState {
  accessToken?: string;
  accessTokenExpiresAt?: number;
  registrationEmail?: string;
  registrationIdempotencyKey?: string;
  attemptId?: string;
  documentSession?: DocumentCaptureSession;
  livenessSession?: LivenessSession;
  result?: VerificationSubmission;
}

const CLIENT_INSTANCE_COOKIE_NAME = "mucyora_client_instance";
const CLIENT_INSTANCE_PATTERN = /^[A-Za-z0-9._:-]{16,128}$/;
const state: FlowState = {};
let clientInstanceId: string | undefined;

export function setAuthSession(result: AuthTokenResult): void {
  state.accessToken = result.accessToken;
  state.accessTokenExpiresAt =
    Date.now() + Math.max(0, result.expiresIn - 30) * 1_000;
}

export function getAccessToken(): string | undefined {
  return state.accessToken &&
    state.accessTokenExpiresAt &&
    state.accessTokenExpiresAt > Date.now()
    ? state.accessToken
    : undefined;
}

export function clearAuthSession(): void {
  delete state.accessToken;
  delete state.accessTokenExpiresAt;
}

export function authFlowState(): FlowState {
  return state;
}

export function resetIdentityFlow(): void {
  delete state.attemptId;
  delete state.documentSession;
  delete state.livenessSession;
  delete state.result;
}

export function browserClientInstanceId(): string {
  if (clientInstanceId) return clientInstanceId;

  if (typeof document !== "undefined") {
    const stored = readCookie(CLIENT_INSTANCE_COOKIE_NAME);
    if (stored && CLIENT_INSTANCE_PATTERN.test(stored)) {
      clientInstanceId = stored;
      return stored;
    }
  }

  clientInstanceId = createIdentifier("web");

  if (typeof document !== "undefined") {
    const secure = globalThis.location?.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CLIENT_INSTANCE_COOKIE_NAME}=${encodeURIComponent(clientInstanceId)}; Path=/; SameSite=Strict${secure}`;
  }

  return clientInstanceId;
}

export function browserDeviceId(): string {
  return browserClientInstanceId();
}

export function registrationIdempotencyKey(): string {
  state.registrationIdempotencyKey ??= createIdentifier("registration");
  return state.registrationIdempotencyKey;
}

export function beginRegistrationSubmission(): void {
  state.registrationIdempotencyKey = createIdentifier("registration");
}

export function browserDeviceLabel(): string {
  if (typeof navigator === "undefined") return "MUCYORA web browser";
  return `MUCYORA web · ${navigator.platform || "browser"}`.slice(0, 100);
}

function createIdentifier(prefix: string): string {
  const randomPart = globalThis.crypto?.randomUUID?.();
  if (!randomPart) {
    throw new Error("Secure browser randomness is unavailable.");
  }
  return `${prefix}-${randomPart}`;
}

function readCookie(name: string): string | undefined {
  const prefix = `${name}=`;
  const item = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(prefix));
  return item ? decodeURIComponent(item.slice(prefix.length)) : undefined;
}
