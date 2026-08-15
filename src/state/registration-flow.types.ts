export type RegistrationStep =
    | "CITIZEN_LOOKUP"
    | "CREDENTIALS"
    | "CONSENT"
    | "COMPLETE";

export interface RegistrationFlowState {
    step: RegistrationStep;
    registrationChallengeToken?: string;
    email?: string;
    maskedEmail?: string;
    userReference?: string;
}

export type RegistrationFlowAction =
    | {
        type: "CITIZEN_FOUND";
        registrationChallengeToken: string;
    }
    | { type: "CREDENTIALS_COMPLETED"; email: string }
    | {
        type: "REGISTRATION_COMPLETED";
        maskedEmail: string;
        userReference: string;
    }
    | { type: "GO_BACK" }
    | { type: "RETURN_TO_CREDENTIALS" }
    | { type: "RESET" };
