import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/forms/LoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "Sign In to MUCYORA",
  },
  description:
    "Access your secure MUCYORA account to manage verified devices, ownership records, and trusted digital transactions.",
};

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to MUCYORA"
      description="Enter your account credentials to create a protected MUCYORA session."
      footer={
        <div className={styles.footer}>
          <p>
            Need a MUCYORA account?{" "}
            <Link
              href="/create-account"
              className={styles.createAccountLink}
            >
              Create an account
            </Link>
          </p>
        </div>
      }
    >
      <div className={styles.content}>
        <LoginForm />
      </div>
    </AuthCard>
  );
}
