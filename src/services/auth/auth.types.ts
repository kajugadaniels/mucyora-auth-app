export type SessionLevel = "LIMITED" | "FULL";
export interface LoginInput { email: string; password: string; }
export interface AuthTokenResult { accessToken: string; expiresIn: number; sessionLevel: SessionLevel; identityVerified: boolean; }
export type LoginResult = AuthTokenResult;
export interface CitizenLookupInput { nationalId: string; }
export interface CitizenLookupResult { registrationChallengeToken: string; expiresAt: string; nextAction: "COMPLETE_REGISTRATION"; }
export type ConsentType = "IDENTITY_DATA_PROCESSING" | "BIOMETRIC_PROCESSING" | "TERMS_OF_SERVICE" | "PRIVACY_POLICY";
export interface RegistrationConsent { type: ConsentType; policyVersion: string; }
export interface RegisterInput { registrationChallengeToken: string; email: string; phoneNumber: string; password: string; consents: RegistrationConsent[]; }
export interface RegisterResult { userReference: string; maskedEmail: string; emailVerificationRequired: true; identityVerificationRequired: true; nextAction: "VERIFY_EMAIL"; }
export interface VerifyEmailResult { status: "verified"; nextAction: "IDENTITY_VERIFICATION"; identityEnrolmentToken: string; identityEnrolmentTokenExpiresIn: number; redirectUrl: string; }
export interface AcceptedResult { status: "accepted"; }
export interface ChangedResult { status: "changed"; }
export interface VerificationAttempt { id: string; status: string; attemptNumber: number; policyVersion: string; retryAfter?: string | null; reasonCode?: string | null; }
export interface DocumentCaptureSession { sessionId: string; clientToken: string; expiresAt: string; captureMode: "LIVE_CAMERA"; providerVersion: string; userUploadAllowed: false; }
export interface DocumentCaptureCompletion { status: "PENDING" | "CONFIRMED"; }
export interface LivenessSession { sessionId: string; expiresAt: string; captureMode: "LIVE_FACE_CAMERA"; userUploadAllowed: false; providerVersion: string; }
export interface VerificationSubmission extends VerificationAttempt { nextAction: "LOGIN" | "RETRY_IDENTITY_VERIFICATION" | "WAIT_FOR_REVIEW" | "WAIT_FOR_PROVIDER" | "STEP_UP_COMPLETED"; redirectUrl?: string; completionExpiresAt?: string; }
export interface IdentityCompletionResult { status: "COMPLETED"; nextAction: "LOGIN"; redirectUrl: string; }
export interface RecoveryCodeResult { resetToken: string; expiresAt: string; }
export interface AuthSessionRecord { id: string; deviceId?: string; deviceLabel?: string | null; createdAt: string; lastSeenAt?: string; expiresAt: string; current?: boolean; }
export type WebAuthnPayload = Record<string, unknown>;
export type ApiPayload = Record<string, unknown>;
