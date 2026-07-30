export type LoginStatus =
  | "AUTHENTICATED"
  | "EMAIL_VERIFICATION_REQUIRED"
  | "IDENTITY_VERIFICATION_REQUIRED";

export interface LoginInput {
  email: string;
  password: string;
  rememberDevice: boolean;
}

export interface LoginResult {
  status: LoginStatus;
  userReference: string;
  displayName: string;
  nextPath?: string;
}

export interface CitizenLookupInput {
  nationalId: string;
}

export interface CitizenPreview {
  reference: string;
  givenNames: string;
  surname: string;
  dateOfBirth: string;
  sex: "Female" | "Male" | "Unspecified";
  nationality: string;
}

export interface CitizenLookupResult {
  challengeReference: string;
  citizen: CitizenPreview;
  expiresInSeconds: number;
}

export interface RegisterInput {
  challengeReference: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedBiometricProcessing: boolean;
}

export interface RegisterResult {
  userReference: string;
  maskedEmail: string;
  nextPath: string;
}

export interface VerifyEmailInput {
  code: string;
}

export interface VerifyEmailResult {
  verified: boolean;
  nextPath: string;
}

export interface ResendVerificationInput {
  email: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  resetReference: string;
  password: string;
}

export type IdentityDocumentScenario =
  | "success"
  | "rejected"
  | "unavailable";

export interface IdentityDocumentInput {
  file: File;
  scenario?: IdentityDocumentScenario;
}

export interface UploadResult {
  uploadReference: string;
  verificationAttemptReference: string;
  progress: number;
  nextPath: string;
}

export type VerificationResultStatus =
  | "PASS"
  | "RETRY"
  | "PENDING"
  | "FAIL"
  | "UNAVAILABLE";

export type VerificationResultScenario =
  | "success"
  | "retry"
  | "pending"
  | "failed"
  | "unavailable";

export interface LiveCheckInput {
  verificationAttemptReference: string;
  scenario?: VerificationResultScenario;
}

export interface LiveCheckResult {
  status: VerificationResultStatus;
  resultReference: string;
  reasonCode: string;
  retryAfterSeconds?: number;
}
