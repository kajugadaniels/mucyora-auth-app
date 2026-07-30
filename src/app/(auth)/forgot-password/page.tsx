import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Recover Your MUCYORA Account" },
  description:
    "Request secure password recovery instructions for your MUCYORA account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Recover access securely"
      description="Enter an email address to preview a privacy-preserving recovery response. The same confirmation appears whether or not an account exists."
      footer={
        <div className={styles.footer}>
          <LinkButton
            href="/login"
            variant="tertiary"
            icon={<ArrowLeft size={16} />}
          >
            Return to sign in
          </LinkButton>
        </div>
      }
    >
      <div className={styles.content}>
        <MockModeNotice compact>
          Use a fake email only. This form does not contact a mail provider or
          backend.
        </MockModeNotice>
        <ForgotPasswordForm />
      </div>
    </AuthCard>
  );
}
