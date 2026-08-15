import type { Metadata } from "next";
import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { Alert } from "@/components/ui/Alert";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusIcon } from "@/components/ui/StatusIcon";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Registration Complete | MUCYORA" },
  description:
    "Review the next secure step after creating and verifying a MUCYORA account.",
  robots: { index: false, follow: false },
};

export default function RegistrationCompletePage() {
  return (
    <AuthCard
      // size="wide"
      title="Your registration is complete"
    >
      <section className={styles.complete}>
        <StatusIcon
          variant="success"
          size="lg"
          label="Registration completed"
        />
        <div className={styles.heading}>
          <span>Account activation</span>
          <h2>Sign in with your verified account</h2>
          <p>
            Your email and identity verification steps are complete. MUCYORA
            requires a fresh login before creating a full session.
          </p>
        </div>

        <Alert
          variant="info"
          title="Fresh login required"
        >
          The limited enrolment session was revoked when verification passed.
          Enter your credentials again to continue.
        </Alert>

        <SecurityNotice>
          MUCYORA will use verified identity, private media handling, and
          controlled biometric evidence before granting full account access.
        </SecurityNotice>

        <div className={styles.actions}>
          <LinkButton href="/login" icon={<LogIn size={16} />} fullWidth>
            Return to sign in
          </LinkButton>
          <LinkButton
            href="/create-account"
            variant="secondary"
            icon={<UserPlus size={16} />}
            fullWidth
          >
            Create another account
          </LinkButton>
        </div>

        <p className={styles.next}>
          <ShieldCheck size={15} aria-hidden="true" />
          This frontend does not persist passwords, National IDs, or provider
          credentials.
        </p>
      </section>
    </AuthCard>
  );
}
