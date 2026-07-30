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
} from "./auth.types";

export interface AuthGateway {
    login(input: LoginInput): Promise<LoginResult>;
    lookupCitizen(input: CitizenLookupInput): Promise<CitizenLookupResult>;
    register(input: RegisterInput): Promise<RegisterResult>;
    verifyEmail(input: VerifyEmailInput): Promise<VerifyEmailResult>;
    resendVerification(input: ResendVerificationInput): Promise<void>;
    forgotPassword(input: ForgotPasswordInput): Promise<void>;
    resetPassword(input: ResetPasswordInput): Promise<void>;
    submitIdentityDocument(input: IdentityDocumentInput): Promise<UploadResult>;
    startLiveCheck(input: LiveCheckInput): Promise<LiveCheckResult>;
}
