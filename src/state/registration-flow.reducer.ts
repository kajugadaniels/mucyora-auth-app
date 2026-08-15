import type {
    RegistrationFlowAction,
    RegistrationFlowState,
    RegistrationStep,
} from "./registration-flow.types";

export const initialRegistrationFlowState: RegistrationFlowState = {
    step: "CITIZEN_LOOKUP",
};

const previousStep: Record<RegistrationStep, RegistrationStep> = {
    CITIZEN_LOOKUP: "CITIZEN_LOOKUP",
    CREDENTIALS: "CITIZEN_LOOKUP",
    CONSENT: "CREDENTIALS",
    COMPLETE: "CONSENT",
};

export function registrationFlowReducer(
    state: RegistrationFlowState,
    action: RegistrationFlowAction,
): RegistrationFlowState {
    switch (action.type) {
        case "CITIZEN_FOUND":
            return {
                ...state,
                step: "CREDENTIALS",
                registrationChallengeToken: action.registrationChallengeToken,
            };
        case "CREDENTIALS_COMPLETED":
            return {
                ...state,
                step: "CONSENT",
                email: action.email,
            };
        case "REGISTRATION_COMPLETED":
            return {
                ...state,
                step: "COMPLETE",
                maskedEmail: action.maskedEmail,
                userReference: action.userReference,
            };
        case "RETURN_TO_CREDENTIALS":
            return {
                ...state,
                step: "CREDENTIALS",
            };
        case "GO_BACK":
            return {
                ...state,
                step: previousStep[state.step],
            };
        case "RESET":
            return initialRegistrationFlowState;
        default:
            return state;
    }
}
