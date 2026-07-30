import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { CreateAccountFlow } from "@/components/auth/CreateAccountFlow";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Create a Verified MUCYORA Account" },
  description:
    "Create a secure MUCYORA account using your Rwanda National ID and prepare to verify device ownership with trusted digital records.",
};

export default function CreateAccountPage() {
  return (
    <AuthCard
      size="wide"
      eyebrow="Create your account"
      title="Start with your verified identity"
      description="Follow the static NID registration flow, review the fake citizen match, create credentials, and acknowledge the required policies."
      footer={
        <div className={styles.footer}>
          <p>Already have a MUCYORA account?</p>
          <LinkButton
            href="/login"
            variant="tertiary"
            icon={<LogIn size={16} />}
          >
            Sign in instead
          </LinkButton>
        </div>
      }
    >
      <div className={styles.content}>
        <MockModeNotice compact>
          Use only the supplied fake National IDs and account details. No NIDA
          or backend request is made.
        </MockModeNotice>
        <CreateAccountFlow />
      </div>
    </AuthCard>
  );
}
