import { describe, expect, it } from "vitest";
import { loginSchema, registrationSchema } from "./auth.schemas";

describe("authentication validation schemas", () => {
    it("accepts the static login demonstration credentials", () => {
        expect(
            loginSchema.safeParse({
                email: "user@mucyora.test",
                password: "MucyoraDemo123!",
                rememberDevice: false,
            }).success,
        ).toBe(true);
    });

    it("rejects mismatched registration passwords", () => {
        const result = registrationSchema.safeParse({
            email: "new@mucyora.test",
            password: "A-long-static-password",
            confirmPassword: "Different-static-password",
            acceptedTerms: true,
            acceptedPrivacy: true,
            acceptedBiometricProcessing: true,
        });

        expect(result.success).toBe(false);
    });
});
