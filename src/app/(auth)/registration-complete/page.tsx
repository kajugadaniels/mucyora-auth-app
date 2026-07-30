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
    <AuthCard size="wide" title="Your static registration flow is complete">
      <section className={styles.complete}>
        <StatusIcon
          variant="success"
          size="lg"
          label="Registration completed"
        />
        <div className={styles.heading}>
          <span>Account activation demonstration</span>
          <h2>Continue securely when backend integration is enabled</h2>
          <p>
            In the real platform, a verified email unlocks the next onboarding
            step: protected identity verification. This static build did not
            create an account or session.
          </p>
        </div>

        <Alert
          variant="info"
          title="Identity verification is intentionally deferred"
        >
          The document and live-check interface will be implemented in the next
          authorized phase. This page does not link to an unfinished route.
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
            Restart registration demo
          </LinkButton>
        </div>

        <p className={styles.next}>
          <ShieldCheck size={15} aria-hidden="true" />
          No password, token, NID, consent record, or verification media was
          retained.
        </p>
      </section>
    </AuthCard>
  );
}
