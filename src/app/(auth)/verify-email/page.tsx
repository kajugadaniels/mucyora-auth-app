import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { EmailVerificationForm } from "@/components/forms/EmailVerificationForm";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Verify Your Email | MUCYORA" },
  description:
    "Verify your email address to continue securing your MUCYORA account.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <AuthCard
      eyebrow="Email verification"
      title="Confirm your email address"
      description="Enter the static six-digit code and preview resend, invalid-code, expired-code, and success states."
      footer={
        <div className={styles.footer}>
          <Link
              href="/create-account"
              className={styles.createAccountLink}
            >
              Return to account creation
            </Link>
        </div>
      }
    >
      <div className={styles.content}>
        <MockModeNotice compact>
          No email was sent. Use the demonstration code shown in the form.
        </MockModeNotice>
        <EmailVerificationForm />
      </div>
    </AuthCard>
  );
}
