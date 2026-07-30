export const authRoutes = [
    "/",
    "/login/",
    "/create-account/",
    "/verify-email/",
    "/registration-complete/",
    "/forgot-password/",
    "/reset-password/",
    "/identity-verification/",
    "/identity-verification/document/",
    "/identity-verification/live-check/",
    "/identity-verification/result/",
    "/verification-required/",
    "/session-expired/",
    "/account-locked/",
] as const;

export const stableVisualRoutes = [
    { path: "/", name: "home" },
    { path: "/login/", name: "login" },
    {
        path: "/create-account/",
        name: "create-account",
    },
    {
        path: "/identity-verification/",
        name: "identity-verification",
    },
    {
        path: "/session-expired/",
        name: "session-expired",
    },
] as const;
