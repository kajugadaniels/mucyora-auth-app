import type {
    LiveCheckResult,
    VerificationResultScenario,
} from "@/services/auth/auth.types";

export interface VerificationResultContent {
    scenario: VerificationResultScenario;
    status: LiveCheckResult["status"];
    resultReference: string;
    reasonCode: string;
    eyebrow: string;
    title: string;
    description: string;
    detailTitle: string;
    detail: string;
    retryAfterSeconds?: number;
}

export const mockVerificationResults: Record<
    VerificationResultScenario,
    VerificationResultContent
> = {
    success: {
        scenario: "success",
        status: "PASS",
        resultReference: "mock-verification-pass",
        reasonCode: "VERIFICATION_PASSED",
        eyebrow: "Verification complete",
        title: "Your identity check passed",
        description:
            "The static demonstration completed successfully. A real integration would now update the verified-account state and allow a full session.",
        detailTitle: "What happens next",
        detail:
            "After backend integration, MUCYORA would securely upgrade the account from limited access to the verified user experience.",
    },
    retry: {
        scenario: "retry",
        status: "RETRY",
        resultReference: "mock-verification-retry",
        reasonCode: "CAPTURE_QUALITY_RETRY",
        eyebrow: "Another capture is needed",
        title: "Please try the live check again",
        description:
            "The simulated capture did not meet the required quality. This does not mean that the identity information was incorrect.",
        detailTitle: "Improve the next capture",
        detail:
            "Use even lighting, keep your face centered, remove anything covering your face, and hold the device steady.",
        retryAfterSeconds: 30,
    },
    pending: {
        scenario: "pending",
        status: "PENDING",
        resultReference: "mock-verification-pending",
        reasonCode: "VERIFICATION_PENDING",
        eyebrow: "Verification pending",
        title: "Your verification is being reviewed",
        description:
            "This static state demonstrates a verification result that requires more processing or a controlled manual review.",
        detailTitle: "No action is required now",
        detail:
            "A real MUCYORA integration would show the latest server-authoritative status and notify you when the review is complete.",
    },
    failed: {
        scenario: "failed",
        status: "FAIL",
        resultReference: "mock-verification-failed",
        reasonCode: "IDENTITY_MATCH_FAILED",
        eyebrow: "Verification not completed",
        title: "We could not verify this attempt",
        description:
            "The simulated result could not establish the required match. Sensitive thresholds and provider details are intentionally not displayed.",
        detailTitle: "Protecting your account",
        detail:
            "A real implementation would apply retry limits, preserve safe audit evidence, and provide a controlled support or review path.",
    },
    unavailable: {
        scenario: "unavailable",
        status: "UNAVAILABLE",
        resultReference: "mock-verification-unavailable",
        reasonCode: "PROVIDER_UNAVAILABLE",
        eyebrow: "Service temporarily unavailable",
        title: "The verification service could not respond",
        description:
            "This simulated provider outage is separate from an identity failure. Your identity has not been rejected.",
        detailTitle: "Try again safely",
        detail:
            "A production implementation would preserve the attempt state, avoid charging an attempt, and provide a server-authoritative retry time.",
        retryAfterSeconds: 20,
    },
};

export function getMockVerificationResult(
    scenario: string | null | undefined,
): VerificationResultContent {
    if (
        scenario === "retry" ||
        scenario === "pending" ||
        scenario === "failed" ||
        scenario === "unavailable"
    ) {
        return mockVerificationResults[scenario];
    }

    return mockVerificationResults.success;
}
