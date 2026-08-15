import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Recover Your MUCYORA Account",
  },
  description:
    "Request secure password recovery instructions for your MUCYORA account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Recover access securely"
      description="Enter your email address to request a privacy-preserving recovery link."
      footer={
        <div className={styles.footer}>
          <Link
              href="/login"
              className={styles.createAccountLink}
            >
              Return to sign in
            </Link>
        </div>
      }
    >
      <div className={styles.content}>
        <ForgotPasswordForm />
      </div>
    </AuthCard>
  );
}
