import type { Metadata } from "next";
import { LogOut, ShieldCheck } from "lucide-react";
import { AccountStatusPanel } from "@/components/auth/AccountStatusPanel";
import { AuthCard } from "@/components/auth/AuthCard";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Identity Verification Required | MUCYORA" },
  description:
    "Complete identity verification to activate protected MUCYORA account capabilities.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={styles.page}>
      <AuthCard
        eyebrow="Limited account access"
        title="Identity verification is required"
        description="Your email and credentials may be accepted, but protected MUCYORA features remain unavailable until identity verification is complete."
      >
        <AccountStatusPanel
          iconVariant="warning"
          iconLabel="Identity verification required"
          alertVariant="warning"
          alertTitle="Your account is in limited-access mode"
          alertMessage="This static state demonstrates the account gate shown before device, ownership, agreement, or signing features become available."
          details={[
            {
              label: "Available now",
              value:
                "Authentication status, verification steps, and secure sign out",
            },
            {
              label: "Protected until verified",
              value: "Devices, ownership transfers, agreements, and signatures",
            },
            {
              label: "Next action",
              value: "Complete the guided identity-verification process",
            },
          ]}
          actions={
            <>
              <LinkButton
                href="/identity-verification"
                icon={<ShieldCheck size={16} />}
              >
                Start identity verification
              </LinkButton>
              <LinkButton
                href="/login"
                variant="secondary"
                icon={<LogOut size={16} />}
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
