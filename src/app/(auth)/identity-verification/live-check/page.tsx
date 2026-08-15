import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { VerificationStepper } from "@/components/auth/VerificationStepper";
import { LinkButton } from "@/components/ui/LinkButton";
import { RouteLoadingPanel } from "@/components/ui/RouteLoadingPanel";
import styles from "./page.module.css";

const LiveCheckForm = dynamic(
  () =>
    import("@/components/forms/LiveCheckForm").then(
      (module) => module.LiveCheckForm,
    ),
  {
    loading: () => (
      <RouteLoadingPanel
        title="Preparing live-check controls"
        description="The protected liveness provider handoff is loading."
      />
    ),
  },
);

export const metadata: Metadata = {
  title: {
    absolute: "Live Identity Check | MUCYORA",
  },
  description:
    "Continue the secure MUCYORA identity-verification process with a guided live-face check.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LiveCheckPage() {
  return (
    <AuthCard
      size="wide"
      eyebrow="Guided live check"
      title="Center your face and follow the guidance"
      description="Complete the approved provider's live-face and liveness checks."
      footer={
        <div className={styles.footer}>
          <LinkButton
            href="/identity-verification/document"
            variant="tertiary"
            icon={<ArrowLeft size={16} />}
          >
            Return to identity image
          </LinkButton>
        </div>
      }
    >
      <div className={styles.content}>
        <VerificationStepper currentStep="live-check" />

        <LiveCheckForm />
      </div>
    </AuthCard>
  );
}
