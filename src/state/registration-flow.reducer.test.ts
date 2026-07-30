import { describe, expect, it } from "vitest";
import {
    initialRegistrationFlowState,
    registrationFlowReducer,
} from "./registration-flow.reducer";

const citizen = {
    reference: "mock-citizen",
    givenNames: "Aline",
    surname: "Mucyora",
    dateOfBirth: "1990-01-01",
    sex: "Female" as const,
    nationality: "Rwandan",
};

describe("registrationFlowReducer", () => {
    it("moves from citizen lookup to review", () => {
        const state = registrationFlowReducer(initialRegistrationFlowState, {
            type: "CITIZEN_FOUND",
            challengeReference: "challenge",
            citizen,
        });

        expect(state.step).toBe("CITIZEN_REVIEW");
        expect(state.citizen).toEqual(citizen);
    });

    it("records registration completion without storing a password", () => {
        const state = registrationFlowReducer(
            {
                step: "CONSENT",
                challengeReference: "challenge",
                citizen,
                email: "person@example.com",
            },
            {
                type: "REGISTRATION_COMPLETED",
                maskedEmail: "p••••@example.com",
                userReference: "user-reference",
            },
        );

        expect(state.step).toBe("COMPLETE");
        expect(state.maskedEmail).toBe("p••••@example.com");
        expect(state).not.toHaveProperty("password");
    });

    it("returns to credentials when the gateway reports an email conflict", () => {
        const state = registrationFlowReducer(
            { step: "CONSENT", email: "existing@example.com" },
            { type: "RETURN_TO_CREDENTIALS" },
        );

        expect(state.step).toBe("CREDENTIALS");
    });
});