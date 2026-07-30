export type AuthGatewayErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_NOT_VERIFIED"
  | "IDENTITY_VERIFICATION_REQUIRED"
  | "ACCOUNT_LOCKED"
  | "CITIZEN_NOT_FOUND"
  | "CITIZEN_ALREADY_REGISTERED"
  | "EMAIL_ALREADY_USED"
  | "VERIFICATION_CODE_INVALID"
  | "VERIFICATION_CODE_EXPIRED"
  | "RESET_REFERENCE_EXPIRED"
  | "MEDIA_REJECTED"
  | "VERIFICATION_ATTEMPT_EXPIRED"
  | "CAMERA_PERMISSION_DENIED"
  | "PROVIDER_UNAVAILABLE"
  | "UNEXPECTED_ERROR";

export class AuthGatewayError extends Error {
  constructor(
    public readonly code: AuthGatewayErrorCode,
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = "AuthGatewayError";
  }
}

export function isAuthGatewayError(
  error: unknown,
): error is AuthGatewayError {
  return error instanceof AuthGatewayError;
}
