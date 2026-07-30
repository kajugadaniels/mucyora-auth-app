import type { Metadata } from "next";
import { Home, LogIn } from "lucide-react";
import { AccountStatusPanel } from "@/components/auth/AccountStatusPanel";
import { AuthCard } from "@/components/auth/AuthCard";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Session Expired | MUCYORA" },
  description:
    "Return to secure MUCYORA sign-in after your authentication session expires.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={styles.page}>
      <AuthCard
        eyebrow="Session ended"
        title="Your session has expired"
        description="For account protection, authentication sessions end after their approved lifetime or when security policy requires a new sign-in."
      >
        <AccountStatusPanel
          iconVariant="pending"
          iconLabel="Session expired"
          alertVariant="info"
          alertTitle="Sign in again to continue"
          alertMessage="The static frontend does not retain passwords, identity images, one-time codes, or unsent sensitive form values."
          details={[
            {
              label: "Account state",
              value: "No account change is implied by session expiry",
            },
            {
              label: "Sensitive values",
              value: "Not retained by this static demonstration",
            },
            {
              label: "Recommended action",
              value: "Open a fresh secure sign-in page",
            },
          ]}
          actions={
            <>
              <LinkButton href="/login" icon={<LogIn size={16} />}>
                Sign in again
              </LinkButton>
              <LinkButton
                href="/"
                variant="secondary"
                icon={<Home size={16} />}
              >
                Authentication home
              </LinkButton>
            </>
          }
        />
      </AuthCard>
    </div>
  );
}
