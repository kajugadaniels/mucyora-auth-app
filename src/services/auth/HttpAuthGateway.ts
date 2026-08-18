import type { AuthGateway } from "./AuthGateway";
import { AuthGatewayError } from "./auth.errors";
import {
  authFlowState,
  beginRegistrationSubmission,
  browserClientInstanceId,
  browserDeviceId,
  browserDeviceLabel,
  clearAuthSession,
  getAccessToken,
  registrationIdempotencyKey,
  setAuthSession,
} from "./auth-session";
import type { AcceptedResult, ApiPayload, AuthSessionRecord, AuthTokenResult, ChangedResult, CitizenLookupInput, CitizenLookupResult, DocumentCaptureCompletion, DocumentCaptureSession, IdentityCompletionResult, LivenessSession, LoginInput, RecoveryCodeResult, RegisterInput, RegisterResult, VerificationAttempt, VerificationSubmission, VerifyEmailResult, WebAuthnPayload } from "./auth.types";

const CSRF_COOKIE_NAME = process.env.NEXT_PUBLIC_MUCYORA_CSRF_COOKIE_NAME || "mucyora_csrf";
let refreshRequest: Promise<AuthTokenResult> | undefined;

function csrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const item = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${CSRF_COOKIE_NAME}=`));
  return item ? decodeURIComponent(item.slice(CSRF_COOKIE_NAME.length + 1)) : undefined;
}

function backendMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "The request could not be completed.";
  const message = (body as { message?: unknown }).message;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && message.every((item) => typeof item === "string")) return message.join(" ");
  return "The request could not be completed.";
}

function fieldFrom(message: string): string | undefined {
  return ["email", "phoneNumber", "confirmPassword", "password", "nationalId", "token", "consents"].find((field) => message.toLowerCase().includes(field.toLowerCase()));
}

async function request<Result>(path: string, options: RequestInit = {}): Promise<Result> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  const csrf = csrfToken();
  if (csrf) headers.set("X-CSRF-Token", csrf);
  if (options.body) headers.set("Content-Type", "application/json");
  const response = await fetch(path, { ...options, headers, credentials: "include", cache: "no-store" });
  const contentType = response.headers.get("content-type") || "";
  const body: unknown = response.status === 204 ? undefined : contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const record = body && typeof body === "object" ? body as Record<string, unknown> : {};
    const message = backendMessage(body);
    throw new AuthGatewayError(
      typeof record.code === "string" ? record.code : "REQUEST_FAILED",
      message,
      response.status,
      typeof record.correlationId === "string" ? record.correlationId : response.headers.get("x-correlation-id") || undefined,
      fieldFrom(message),
    );
  }
  return body as Result;
}

async function refreshSession(): Promise<AuthTokenResult> {
  const result = await request<AuthTokenResult>("/auth/refresh", { method: "POST", body: JSON.stringify({ transport: "COOKIE" }) });
  setAuthSession(result);
  return result;
}

async function authorized<Result>(path: string, options: RequestInit = {}): Promise<Result> {
  let token = getAccessToken();
  if (!token) {
    refreshRequest ??= refreshSession().finally(() => { refreshRequest = undefined; });
    token = (await refreshRequest).accessToken;
  }
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  try { return await request<Result>(path, { ...options, headers }); }
  catch (error) { if (error instanceof AuthGatewayError && error.statusCode === 401) clearAuthSession(); throw error; }
}

export class HttpAuthGateway implements AuthGateway {
  async login(input: LoginInput) { const result = await request<AuthTokenResult>("/auth/login", { method: "POST", body: JSON.stringify({ ...input, deviceId: browserDeviceId(), deviceLabel: browserDeviceLabel(), transport: "COOKIE" }) }); setAuthSession(result); return result; }
  refresh() { return refreshSession(); }
  async logout() { await authorized<void>("/auth/logout", { method: "POST" }); clearAuthSession(); }
  async logoutAll() { await authorized<void>("/auth/logout-all", { method: "POST" }); clearAuthSession(); }
  sessions() { return authorized<AuthSessionRecord[]>("/auth/sessions"); }
  revokeSession(id: string) { return authorized<void>(`/auth/sessions/${encodeURIComponent(id)}`, { method: "DELETE" }); }
  changePassword(currentPassword: string, newPassword: string) { return authorized<ChangedResult>("/auth/password/change", { method: "POST", body: JSON.stringify({ currentPassword, newPassword }) }); }
  forgotPassword(email: string) { return request<AcceptedResult>("/auth/password/forgot", { method: "POST", body: JSON.stringify({ email }) }); }
  resetPassword(token: string, newPassword: string) { return request<ChangedResult>("/auth/password/reset", { method: "POST", body: JSON.stringify({ token, newPassword }) }); }
  async lookupCitizen(input: CitizenLookupInput) {
    const result = await request<CitizenLookupResult>(
      "/registration/citizen/lookup",
      {
        method: "POST",
        headers: {
          "X-Client-Instance-Id": browserClientInstanceId(),
        },
        body: JSON.stringify({ nid: input.nationalId }),
      },
    );
    beginRegistrationSubmission();
    return result;
  }
  register(input: RegisterInput) {
    return request<RegisterResult>("/registration", {
      method: "POST",
      headers: {
        "Idempotency-Key": registrationIdempotencyKey(),
        "X-Client-Instance-Id": browserClientInstanceId(),
      },
      body: JSON.stringify(input),
    });
  }
  verifyEmail(token: string) { return request<VerifyEmailResult>("/registration/email/verify", { method: "POST", body: JSON.stringify({ token }) }); }
  resendVerification(email: string) { return request<AcceptedResult>("/registration/email/resend", { method: "POST", body: JSON.stringify({ email }) }); }
  async exchangeIdentitySession(token: string) { const result = await request<AuthTokenResult>("/registration/identity-session", { method: "POST", body: JSON.stringify({ token, deviceId: browserDeviceId(), deviceLabel: browserDeviceLabel(), transport: "COOKIE" }) }); setAuthSession(result); return result; }
  async createIdentityAttempt() { const result = await authorized<VerificationAttempt>("/identity-verification/attempts", { method: "POST" }); authFlowState().attemptId = result.id; return result; }
  identityStatus() { return authorized<ApiPayload>("/identity-verification/status"); }
  identityAttempt(id: string) { return authorized<VerificationAttempt>(`/identity-verification/attempts/${encodeURIComponent(id)}`); }
  async createDocumentCaptureSession(id: string) { const result = await authorized<DocumentCaptureSession>(`/identity-verification/attempts/${encodeURIComponent(id)}/document-capture-session`, { method: "POST" }); authFlowState().documentSession = result; return result; }
  completeDocumentCapture(id: string) { return authorized<DocumentCaptureCompletion>(`/identity-verification/attempts/${encodeURIComponent(id)}/document-capture/complete`, { method: "POST" }); }
  async createLivenessSession(id: string) { const result = await authorized<LivenessSession>(`/identity-verification/attempts/${encodeURIComponent(id)}/liveness-session`, { method: "POST" }); authFlowState().livenessSession = result; return result; }
  async submitIdentityAttempt(id: string) { const result = await authorized<VerificationSubmission>(`/identity-verification/attempts/${encodeURIComponent(id)}/submit`, { method: "POST" }); authFlowState().result = result; return result; }
  requestManualReview(id: string, reason: string) { return authorized<VerificationAttempt>(`/identity-verification/attempts/${encodeURIComponent(id)}/manual-review`, { method: "POST", body: JSON.stringify({ reason }) }); }
  consumeIdentityCompletion(completionReference: string) { return request<IdentityCompletionResult>("/registration/identity-completion/consume", { method: "POST", body: JSON.stringify({ completionReference }) }); }
  passkeys() { return authorized<ApiPayload[]>("/auth/passkeys"); }
  deletePasskey(id: string) { return authorized<void>(`/auth/passkeys/${encodeURIComponent(id)}`, { method: "DELETE" }); }
  passkeyRegistrationOptions(label?: string) { return authorized<WebAuthnPayload>("/auth/passkeys/registration/options", { method: "POST", body: JSON.stringify({ label }) }); }
  verifyPasskeyRegistration(response: WebAuthnPayload, label?: string) { return authorized<ApiPayload>("/auth/passkeys/registration/verify", { method: "POST", body: JSON.stringify({ response, label }) }); }
  passkeyAuthenticationOptions(email: string) { return request<WebAuthnPayload>("/auth/passkeys/authentication/options", { method: "POST", body: JSON.stringify({ email }) }); }
  async verifyPasskeyAuthentication(input: ApiPayload) { const result = await request<AuthTokenResult>("/auth/passkeys/authentication/verify", { method: "POST", body: JSON.stringify({ ...input, deviceId: browserDeviceId(), deviceLabel: browserDeviceLabel(), transport: "COOKIE" }) }); setAuthSession(result); return result; }
  recoveryCodes() { return authorized<ApiPayload>("/auth/passkeys/recovery-codes", { method: "POST" }); }
  consumeRecoveryCode(email: string, recoveryCode: string) { return request<RecoveryCodeResult>("/auth/recovery-codes/consume", { method: "POST", body: JSON.stringify({ email, recoveryCode }) }); }
  createStepUpChallenge(purpose: string, targetResourceId: string) { return authorized<ApiPayload>("/step-up/challenges", { method: "POST", body: JSON.stringify({ purpose, targetResourceId }) }); }
  stepUpChallenge(id: string) { return authorized<ApiPayload>(`/step-up/challenges/${encodeURIComponent(id)}`); }
  issueStepUpAssertion(id: string) { return authorized<ApiPayload>(`/step-up/challenges/${encodeURIComponent(id)}/assertion`, { method: "POST" }); }
}
export const authGateway = new HttpAuthGateway();
