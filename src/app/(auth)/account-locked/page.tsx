import { Key01Icon, Login01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { AccountStatusPanel } from "@/components/auth/AccountStatusPanel";
import { AuthCard } from "@/components/auth/AuthCard";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "Account Access Temporarily Restricted | MUCYORA",
  },
  description:
    "Review secure recovery options when access to a MUCYORA account is temporarily restricted.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className={styles.page}>
      <AuthCard
        eyebrow="Account protection"
        title="Access is temporarily restricted"
        description="MUCYORA may pause authentication after suspicious or repeated attempts. This page avoids revealing internal fraud or security controls."
      >
        <AccountStatusPanel
          iconVariant="error"
          iconLabel="Account temporarily restricted"
          alertVariant="error"
          alertTitle="Do not continue guessing credentials"
          alertMessage="Use the approved recovery path or wait for the server-authoritative restriction period. A production response would not expose exact security thresholds."
          details={[
            {
              label: "Account disclosure",
              value: "No additional identity or security details are shown",
            },
            {
              label: "Safe recovery",
              value: "Password recovery or approved support review",
            },
            {
              label: "Security advice",
              value: "Do not share passwords or verification codes",
            },
          ]}
          actions={
            <>
              <LinkButton
                href="/forgot-password"
                icon={
                  <HugeiconsIcon
                    icon={Key01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                }
              >
                Recover account
              </LinkButton>

              <LinkButton
                href="/login"
                variant="secondary"
                icon={
                  <HugeiconsIcon
                    icon={Login01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                }
              >
                Return to sign in
              </LinkButton>
            </>
          }
        />
      </AuthCard>
    </div>
  );
}
