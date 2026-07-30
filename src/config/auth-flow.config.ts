export const authFlowConfig = {
    mockDelayMs: 760,
    emailVerificationCodeLength: 6,
    resendCountdownSeconds: 60,
    registrationChallengeSeconds: 600,
    image: {
        maximumBytes: 5 * 1024 * 1024,
        acceptedTypes: ["image/jpeg", "image/png"],
    },
} as const;
