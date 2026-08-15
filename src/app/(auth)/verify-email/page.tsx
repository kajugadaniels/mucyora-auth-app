import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { EmailVerificationForm } from "@/components/forms/EmailVerificationForm";
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
      description="Use the single-use link sent to your email address to continue identity verification."
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
        <Suspense fallback={null}><EmailVerificationForm /></Suspense>
      </div>
    </AuthCard>
  );
}
