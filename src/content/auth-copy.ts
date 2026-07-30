export interface AuthBrandContent {
    eyebrow: string;
    title: string;
    description: string;
    illustration: string;
    illustrationAlt: string;
}

const defaultContent: AuthBrandContent = {
    eyebrow: "Secure MUCYORA access",
    title: "Start with identity you can trust.",
    description:
        "Create or access your verified MUCYORA account through a clear, private, and protected authentication experience.",
    illustration: "/brand/auth-illustration.svg",
    illustrationAlt: "Abstract secure identity illustration",
};

const routeContent: Array<{
    matches: (pathname: string) => boolean;
    content: AuthBrandContent;
}> = [
        {
            matches: (pathname) => pathname === "/login",
            content: {
                eyebrow: "Welcome back",
                title: "Continue managing trusted ownership.",
                description:
                    "Sign in to securely access your verified devices, ownership records, and protected MUCYORA services.",
                illustration: "/brand/auth-illustration.svg",
                illustrationAlt: "Secure sign-in illustration",
            },
        },
        {
            matches: (pathname) =>
                pathname === "/create-account",
            content: {
                eyebrow: "Verified registration",
                title:
                    "Create an account around trusted identity.",
                description:
                    "Follow a clear National ID registration flow, review the matched citizen information, and prepare your protected MUCYORA credentials.",
                illustration: "/brand/auth-illustration.svg",
                illustrationAlt:
                    "Secure account registration illustration",
            },
        },
        {
            matches: (pathname) =>
                pathname === "/verify-email" ||
                pathname === "/registration-complete",
            content: {
                eyebrow: "Account activation",
                title: "Complete each step with confidence.",
                description:
                    "Confirm your email address and review the next secure action before continuing to identity verification.",
                illustration: "/brand/auth-illustration.svg",
                illustrationAlt:
                    "Account activation illustration",
            },
        },
        {
            matches: (pathname) =>
                pathname === "/forgot-password" ||
                pathname === "/reset-password",
            content: {
                eyebrow: "Secure account recovery",
                title:
                    "Recover access without exposing your account.",
                description:
                    "MUCYORA uses clear, privacy-preserving recovery steps and never reveals whether an email belongs to an account.",
                illustration: "/brand/auth-illustration.svg",
                illustrationAlt:
                    "Secure password recovery illustration",
            },
        },
        {
            matches: (pathname) =>
                pathname.startsWith(
                    "/identity-verification",
                ) ||
                pathname === "/verification-required",
            content: {
                eyebrow: "Identity protection",
                title:
                    "Verification designed around your privacy.",
                description:
                    "MUCYORA guides each identity step clearly and keeps sensitive verification evidence within controlled private systems.",
                illustration:
                    "/brand/verification-illustration.svg",
                illustrationAlt:
                    "Private identity verification illustration",
            },
        },
        {
            matches: (pathname) =>
                pathname === "/session-expired" ||
                pathname === "/account-locked",
            content: {
                eyebrow: "Account protection",
                title:
                    "Clear recovery when access is interrupted.",
                description:
                    "MUCYORA explains protected account states without exposing security controls or sensitive account details.",
                illustration: "/brand/auth-illustration.svg",
                illustrationAlt:
                    "Protected account access illustration",
            },
        },
    ];

export function getAuthBrandContent(
    pathname: string,
): AuthBrandContent {
    return (
        routeContent.find(({ matches }) =>
            matches(pathname),
        )?.content ?? defaultContent
    );
}