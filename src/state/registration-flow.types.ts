import type { CitizenPreview } from "@/services/auth";

export type RegistrationStep =
    | "CITIZEN_LOOKUP"
    | "CITIZEN_REVIEW"
    | "CREDENTIALS"
    | "CONSENT"
    | "COMPLETE";

export interface RegistrationFlowState {
    step: RegistrationStep;
    challengeReference?: string;
    citizen?: CitizenPreview;
    email?: string;
    maskedEmail?: string;
    userReference?: string;
}

export type RegistrationFlowAction =
    | {
        type: "CITIZEN_FOUND";
        challengeReference: string;
        citizen: CitizenPreview;
    }
    | { type: "CITIZEN_CONFIRMED" }
    | { type: "CREDENTIALS_COMPLETED"; email: string }
    | {
        type: "REGISTRATION_COMPLETED";
        maskedEmail: string;
        userReference: string;
    }
    | { type: "GO_BACK" }
    | { type: "RETURN_TO_CREDENTIALS" }
    | { type: "RESET" };
