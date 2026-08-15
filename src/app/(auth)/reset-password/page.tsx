import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
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
      description="Open your single-use recovery link and choose a new strong password."
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
        <Suspense fallback={null}><ResetPasswordExperience /></Suspense>
      </div>
    </AuthCard>
  );
}
