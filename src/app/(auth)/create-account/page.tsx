import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { CreateAccountFlow } from "@/components/auth/CreateAccountFlow";
import styles from "./page.module.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Create a Verified MUCYORA Account",
  },
  description:
    "Create a secure MUCYORA account using your Rwanda National ID and prepare to verify device ownership with trusted digital records.",
};

export default function CreateAccountPage() {
  return (
    <AuthCard
      size="wide"
      className={styles.card}
      eyebrow="Create your account"
      title="Start with your verified identity"
      description="Confirm your Rwanda National ID, create secure credentials, and record the required policy consents."
      footer={
        <div className={styles.footer}>
          <p>
            Already have a MUCYORA account?{" "}
            <Link
              href="/login"
              className={styles.createAccountLink}
            >
              Sign in instead
            </Link>
          </p>
        </div>
      }
    >
      <div className={styles.content}>
        <CreateAccountFlow />
      </div>
    </AuthCard>
  );
}
