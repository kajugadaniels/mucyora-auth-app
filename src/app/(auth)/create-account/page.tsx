import { Login01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { CreateAccountFlow } from "@/components/auth/CreateAccountFlow";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { LinkButton } from "@/components/ui/LinkButton";
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
      // size="wide"
      eyebrow="Create your account"
      title="Start with your verified identity"
      description="Follow the static NID registration flow, review the fake citizen match, create credentials, and acknowledge the required policies."
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
