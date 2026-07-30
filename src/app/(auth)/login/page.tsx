import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
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
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to MUCYORA"
      description="Enter your account credentials. This phase uses a local mock gateway and does not create a real session."
      footer={
        <div className={styles.footer}>
          <p>Need a MUCYORA account?</p>
          <LinkButton
            href="/"
            variant="tertiary"
            icon={<ArrowLeft size={16} />}
          >
            Return to account options
          </LinkButton>
        </div>
      }
    >
      <div className={styles.content}>
        <MockModeNotice compact>
          Use only the fake credentials displayed below. The form never contacts
          the backend.
        </MockModeNotice>
        <LoginForm />
      </div>
    </AuthCard>
  );
}
