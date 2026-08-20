import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/forms/LoginForm";
import { LinkButton } from "@/components/ui/LinkButton";
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
    <div className={styles.page}>
      <AuthCard
        className={styles.card}
        eyebrow="Welcome back"
        title="Sign in securely"
        description="Use your verified MUCYORA credentials to continue to your protected workspace."
        footer={
          <div className={styles.footer}>
            <span>New to MUCYORA?</span>
            <LinkButton
              href="/create-account"
              variant="tertiary"
              icon={<ArrowRight size={16} />}
            >
              Create an account
            </LinkButton>
          </div>
        }
      >
        <LoginForm />
      </AuthCard>
    </div>
  );
}
