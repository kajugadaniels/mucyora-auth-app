import type { AcceptedResult, ApiPayload, AuthSessionRecord, AuthTokenResult, ChangedResult, CitizenLookupInput, CitizenLookupResult, DocumentCaptureCompletion, DocumentCaptureSession, IdentityCompletionResult, LivenessSession, LoginInput, LoginResult, RecoveryCodeResult, RegisterInput, RegisterResult, VerificationAttempt, VerificationSubmission, VerifyEmailResult, WebAuthnPayload } from "./auth.types";
export interface AuthGateway {
  login(input: LoginInput): Promise<LoginResult>; refresh(): Promise<AuthTokenResult>; logout(): Promise<void>; logoutAll(): Promise<void>;
  sessions(): Promise<AuthSessionRecord[]>; revokeSession(sessionId: string): Promise<void>; changePassword(currentPassword: string, newPassword: string): Promise<ChangedResult>;
  forgotPassword(email: string): Promise<AcceptedResult>; resetPassword(token: string, newPassword: string): Promise<ChangedResult>;
  lookupCitizen(input: CitizenLookupInput): Promise<CitizenLookupResult>; register(input: RegisterInput): Promise<RegisterResult>;
  verifyEmail(token: string): Promise<VerifyEmailResult>; resendVerification(email: string): Promise<AcceptedResult>; exchangeIdentitySession(token: string): Promise<AuthTokenResult>;
  createIdentityAttempt(): Promise<VerificationAttempt>; identityStatus(): Promise<ApiPayload>; identityAttempt(attemptId: string): Promise<VerificationAttempt>;
  createDocumentCaptureSession(attemptId: string): Promise<DocumentCaptureSession>; completeDocumentCapture(attemptId: string): Promise<DocumentCaptureCompletion>;
  createLivenessSession(attemptId: string): Promise<LivenessSession>; submitIdentityAttempt(attemptId: string): Promise<VerificationSubmission>;
  requestManualReview(attemptId: string, reason: string): Promise<VerificationAttempt>; consumeIdentityCompletion(completionReference: string): Promise<IdentityCompletionResult>;
  passkeys(): Promise<ApiPayload[]>; deletePasskey(credentialId: string): Promise<void>; passkeyRegistrationOptions(label?: string): Promise<WebAuthnPayload>;
  verifyPasskeyRegistration(response: WebAuthnPayload, label?: string): Promise<ApiPayload>; passkeyAuthenticationOptions(email: string): Promise<WebAuthnPayload>;
  verifyPasskeyAuthentication(input: ApiPayload): Promise<AuthTokenResult>; recoveryCodes(): Promise<ApiPayload>; consumeRecoveryCode(email: string, recoveryCode: string): Promise<RecoveryCodeResult>;
  createStepUpChallenge(purpose: string, targetResourceId: string): Promise<ApiPayload>; stepUpChallenge(challengeId: string): Promise<ApiPayload>; issueStepUpAssertion(challengeId: string): Promise<ApiPayload>;
}
