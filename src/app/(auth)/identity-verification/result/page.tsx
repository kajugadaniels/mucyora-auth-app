import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { AuthCard } from "@/components/auth/AuthCard";
import { VerificationStepper } from "@/components/auth/VerificationStepper";
import { RouteLoadingPanel } from "@/components/ui/RouteLoadingPanel";
import styles from "./page.module.css";

const VerificationResultExperience = dynamic(
  () =>
    import("@/components/auth/VerificationResultExperience").then(
      (module) => module.VerificationResultExperience,
    ),
  {
    loading: () => (
      <RouteLoadingPanel
        title="Preparing verification result"
        description="The safe result controls and recovery actions are loading."
      />
    ),
  },
);

export const metadata: Metadata = {
  title: {
    absolute: "Identity Verification Result | MUCYORA",
  },
  description:
    "Review the current status of your MUCYORA identity-verification process.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerificationResultPage() {
  return (
    <AuthCard
      size="wide"
      eyebrow="Verification result"
      title="Review the current verification state"
      description="Review the backend decision and the permitted next action."
    >
      <div className={styles.content}>
        <VerificationStepper currentStep="result" />

        <VerificationResultExperience />
      </div>
    </AuthCard>
  );
}
