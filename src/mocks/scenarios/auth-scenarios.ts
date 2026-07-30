export const authMockScenarios = {
    mockDelayMs: 760,

    demoCredentials: {
        email: "user@mucyora.test",
        password: "MucyoraDemo123!",
    },

    emailNotVerified: "unverified@mucyora.test",
    accountLocked: "locked@mucyora.test",
    identityVerificationRequired: "verify@mucyora.test",

    registeredNationalId: "1990000000000002",
    duplicateEmail: "existing@mucyora.test",

    verificationCode: "246810",
    expiredVerificationCode: "111111",

    validResetReference: "mock-reset-valid",
    expiredResetReference: "mock-reset-expired",

    verificationAttemptReference: "mock-verification-attempt",
    verificationRetrySeconds: 30,
} as const;
