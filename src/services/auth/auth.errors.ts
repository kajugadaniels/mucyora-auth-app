export class AuthGatewayError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode: number, public readonly correlationId?: string, public readonly field?: string) {
    super(message);
    this.name = "AuthGatewayError";
  }
}
export function isAuthGatewayError(error: unknown): error is AuthGatewayError { return error instanceof AuthGatewayError; }
