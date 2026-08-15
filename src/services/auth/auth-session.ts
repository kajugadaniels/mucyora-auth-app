import type { AuthTokenResult, DocumentCaptureSession, LivenessSession, VerificationSubmission } from "./auth.types";
interface FlowState { accessToken?: string; accessTokenExpiresAt?: number; registrationEmail?: string; attemptId?: string; documentSession?: DocumentCaptureSession; livenessSession?: LivenessSession; result?: VerificationSubmission; }
const state: FlowState = {};
export function setAuthSession(result: AuthTokenResult): void { state.accessToken = result.accessToken; state.accessTokenExpiresAt = Date.now() + Math.max(0, result.expiresIn - 30) * 1_000; }
export function getAccessToken(): string | undefined { return state.accessToken && state.accessTokenExpiresAt && state.accessTokenExpiresAt > Date.now() ? state.accessToken : undefined; }
export function clearAuthSession(): void { delete state.accessToken; delete state.accessTokenExpiresAt; }
export function authFlowState(): FlowState { return state; }
export function resetIdentityFlow(): void { delete state.attemptId; delete state.documentSession; delete state.livenessSession; delete state.result; }
let deviceId: string | undefined;
export function browserDeviceId(): string { deviceId ??= globalThis.crypto?.randomUUID?.() ?? `browser-${Date.now()}-${Math.random().toString(36).slice(2)}`; return deviceId; }
export function browserDeviceLabel(): string { if (typeof navigator === "undefined") return "MUCYORA web browser"; return `MUCYORA web · ${navigator.platform || "browser"}`.slice(0, 100); }
