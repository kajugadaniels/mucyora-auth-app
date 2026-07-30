import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { ResetPasswordExperience } from "@/components/auth/ResetPasswordExperience";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Set a New MUCYORA Password" },
  description: "Set a new secure password for your MUCYORA account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Set a new password"
      title="Choose a private passphrase"
      description="Preview valid-link, expired-link, validation, loading, and completion states without changing a real credential."
      footer={
        <div className={styles.footer}>
          <LinkButton
            href="/forgot-password"
            variant="tertiary"
            icon={<ArrowLeft size={16} />}
          >
            Return to account recovery
          </LinkButton>
        </div>
      }
    >
      <div className={styles.content}>
        <MockModeNotice compact>
          No reset token is read from the URL and no account password is
          changed.
        </MockModeNotice>
        <ResetPasswordExperience />
      </div>
    </AuthCard>
  );
}
