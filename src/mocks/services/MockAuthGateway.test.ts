import { describe, expect, it } from "vitest";
import { mockCitizenNationalId } from "@/mocks/data/citizens";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { AuthGatewayError } from "@/services/auth";
import { MockAuthGateway } from "./MockAuthGateway";

const gateway = new MockAuthGateway(0);

describe("MockAuthGateway", () => {
  it("accepts the demonstration login", async () => {
    const result = await gateway.login({
      ...authMockScenarios.demoCredentials,
      rememberDevice: false,
    });

    expect(result.status).toBe("AUTHENTICATED");
  });

  it("returns the fake citizen for the documented National ID", async () => {
    const result = await gateway.lookupCitizen({
      nationalId: mockCitizenNationalId,
    });

    expect(result.citizen.givenNames).toBe("Aline");
  });

  it("rejects the already-registered demonstration identity", async () => {
    await expect(
      gateway.lookupCitizen({
        nationalId: authMockScenarios.registeredNationalId,
      }),
    ).rejects.toMatchObject({
      code: "CITIZEN_ALREADY_REGISTERED",
    });
  });

  it("rejects the expired verification code", async () => {
    await expect(
      gateway.verifyEmail({
        code: authMockScenarios.expiredVerificationCode,
      }),
    ).rejects.toMatchObject({
      code: "VERIFICATION_CODE_EXPIRED",
    });
  });

  it("accepts the static password reset reference", async () => {
    await expect(
      gateway.resetPassword({
        resetReference: authMockScenarios.validResetReference,
        password: "A long demonstration password",
      }),
    ).resolves.toBeUndefined();
  });

  it("rejects the expired static password reset reference", async () => {
    await expect(
      gateway.resetPassword({
        resetReference: authMockScenarios.expiredResetReference,
        password: "A long demonstration password",
      }),
    ).rejects.toBeInstanceOf(AuthGatewayError);
  });

  it("returns a prepared static identity image", async () => {
    const file = new File(["image"], "id.png", {
      type: "image/png",
    });

    await expect(
      gateway.submitIdentityDocument({
        file,
        scenario: "success",
      }),
    ).resolves.toMatchObject({
      progress: 100,
      nextPath: "/identity-verification/live-check",
    });
  });

  it("returns the selected live-check result", async () => {
    await expect(
      gateway.startLiveCheck({
        verificationAttemptReference:
          "mock-verification-attempt",
        scenario: "retry",
      }),
    ).resolves.toMatchObject({
      status: "RETRY",
      reasonCode: "CAPTURE_QUALITY_RETRY",
    });
  });
});