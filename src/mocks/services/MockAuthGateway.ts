import { mockCitizen, mockCitizenNationalId } from "@/mocks/data/citizens";
import { mockVerificationResults } from "@/mocks/data/verification-results";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import type { AuthGateway } from "@/services/auth/AuthGateway";
import { AuthGatewayError } from "@/services/auth/auth.errors";
import type {
    CitizenLookupInput,
    CitizenLookupResult,
    ForgotPasswordInput,
    IdentityDocumentInput,
    LiveCheckInput,
    LiveCheckResult,
    LoginInput,
    LoginResult,
    RegisterInput,
    RegisterResult,
    ResendVerificationInput,
    ResetPasswordInput,
    UploadResult,
    VerifyEmailInput,
    VerifyEmailResult,
} from "@/services/auth/auth.types";

function wait(delayMs: number): Promise<void> {
    return new Promise((resolve) => {
        globalThis.setTimeout(resolve, delayMs);
    });
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

const defaultMockDelayMs =
    process.env.NODE_ENV === "test"
        ? 0
        : authMockScenarios.mockDelayMs;

export class MockAuthGateway implements AuthGateway {
    constructor(
        private readonly delayMs = defaultMockDelayMs,
    ) { }

    async login(input: LoginInput): Promise<LoginResult> {
        await wait(this.delayMs);
        const email = normalizeEmail(input.email);

        if (email === authMockScenarios.accountLocked) {
            throw new AuthGatewayError(
                "ACCOUNT_LOCKED",
                "This demonstration account is temporarily locked.",
            );
        }

        if (email === authMockScenarios.emailNotVerified) {
            throw new AuthGatewayError(
                "EMAIL_NOT_VERIFIED",
                "Verify the demonstration email before signing in.",
            );
        }

        if (
            email ===
            authMockScenarios.identityVerificationRequired
        ) {
            if (
                input.password !==
                authMockScenarios.demoCredentials.password
            ) {
                throw new AuthGatewayError(
                    "INVALID_CREDENTIALS",
                    "The email or password is not correct.",
                );
            }

            return {
                status: "IDENTITY_VERIFICATION_REQUIRED",
                userReference:
                    "mock-user-verification-required",
                displayName: "Verification Demo",
                nextPath: "/identity-verification",
            };
        }

        if (
            email !== authMockScenarios.demoCredentials.email ||
            input.password !==
            authMockScenarios.demoCredentials.password
        ) {
            throw new AuthGatewayError(
                "INVALID_CREDENTIALS",
                "The email or password is not correct.",
            );
        }

        return {
            status: "AUTHENTICATED",
            userReference: "mock-user-authenticated",
            displayName: "MUCYORA Demo User",
        };
    }

    async lookupCitizen(
        input: CitizenLookupInput,
    ): Promise<CitizenLookupResult> {
        await wait(this.delayMs);

        if (
            input.nationalId ===
            authMockScenarios.registeredNationalId
        ) {
            throw new AuthGatewayError(
                "CITIZEN_ALREADY_REGISTERED",
                "That demonstration identity is already associated with an account.",
                "nationalId",
            );
        }

        if (input.nationalId !== mockCitizenNationalId) {
            throw new AuthGatewayError(
                "CITIZEN_NOT_FOUND",
                "No demonstration citizen matched that National ID.",
                "nationalId",
            );
        }

        return {
            challengeReference:
                "mock-registration-challenge",
            citizen: mockCitizen,
            expiresInSeconds: 600,
        };
    }

    async register(
        input: RegisterInput,
    ): Promise<RegisterResult> {
        await wait(this.delayMs);

        if (
            normalizeEmail(input.email) ===
            authMockScenarios.duplicateEmail
        ) {
            throw new AuthGatewayError(
                "EMAIL_ALREADY_USED",
                "That demonstration email is already registered.",
                "email",
            );
        }

        if (
            input.challengeReference !==
            "mock-registration-challenge"
        ) {
            throw new AuthGatewayError(
                "UNEXPECTED_ERROR",
                "The static registration challenge is no longer available.",
            );
        }

        return {
            userReference: "mock-registered-user",
            maskedEmail: input.email.replace(
                /(^.).+(@.*$)/,
                "$1••••$2",
            ),
            nextPath: "/verify-email",
        };
    }

    async verifyEmail(
        input: VerifyEmailInput,
    ): Promise<VerifyEmailResult> {
        await wait(this.delayMs);

        if (
            input.code ===
            authMockScenarios.expiredVerificationCode
        ) {
            throw new AuthGatewayError(
                "VERIFICATION_CODE_EXPIRED",
                "The demonstration verification code has expired.",
                "code",
            );
        }

        if (
            input.code !== authMockScenarios.verificationCode
        ) {
            throw new AuthGatewayError(
                "VERIFICATION_CODE_INVALID",
                "The demonstration verification code is not correct.",
                "code",
            );
        }

        return {
            verified: true,
            nextPath: "/registration-complete",
        };
    }

    async resendVerification(
        _input: ResendVerificationInput,
    ): Promise<void> {
        await wait(Math.min(this.delayMs, 520));
    }

    async forgotPassword(
        _input: ForgotPasswordInput,
    ): Promise<void> {
        await wait(this.delayMs);
    }

    async resetPassword(
        input: ResetPasswordInput,
    ): Promise<void> {
        await wait(this.delayMs);

        if (
            input.resetReference ===
            authMockScenarios.expiredResetReference
        ) {
            throw new AuthGatewayError(
                "RESET_REFERENCE_EXPIRED",
                "The demonstration recovery link has expired.",
            );
        }

        if (
            input.resetReference !==
            authMockScenarios.validResetReference
        ) {
            throw new AuthGatewayError(
                "UNEXPECTED_ERROR",
                "The demonstration recovery reference is not valid.",
            );
        }
    }

    async submitIdentityDocument(
        input: IdentityDocumentInput,
    ): Promise<UploadResult> {
        await wait(this.delayMs);

        if (input.scenario === "unavailable") {
            throw new AuthGatewayError(
                "PROVIDER_UNAVAILABLE",
                "The demonstration storage service is temporarily unavailable.",
            );
        }

        if (
            input.scenario === "rejected" ||
            input.file.size === 0
        ) {
            throw new AuthGatewayError(
                "MEDIA_REJECTED",
                "The demonstration image did not pass the media checks.",
                "file",
            );
        }

        return {
            uploadReference: "mock-document-upload",
            verificationAttemptReference:
                authMockScenarios.verificationAttemptReference,
            progress: 100,
            nextPath: "/identity-verification/live-check",
        };
    }

    async startLiveCheck(
        input: LiveCheckInput,
    ): Promise<LiveCheckResult> {
        await wait(Math.max(this.delayMs, 1100));

        if (
            input.verificationAttemptReference !==
            authMockScenarios.verificationAttemptReference
        ) {
            throw new AuthGatewayError(
                "VERIFICATION_ATTEMPT_EXPIRED",
                "The demonstration verification attempt is no longer available.",
            );
        }

        const scenario = input.scenario ?? "success";
        const result = mockVerificationResults[scenario];

        return {
            status: result.status,
            resultReference: result.resultReference,
            reasonCode: result.reasonCode,
            retryAfterSeconds: result.retryAfterSeconds,
        };
    }
}

export const authGateway = new MockAuthGateway();
