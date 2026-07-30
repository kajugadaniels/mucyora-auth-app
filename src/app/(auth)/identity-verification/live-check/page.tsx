import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
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
        description="The static camera and capture simulation is loading."
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
      description="Preview camera permission, capture progress, provider outcomes, and recovery messages without opening a real camera."
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

        <MockModeNotice compact>
          This is a visual simulation only. It does not perform face comparison
          or liveness detection.
        </MockModeNotice>

        <LiveCheckForm />
      </div>
    </AuthCard>
  );
}
