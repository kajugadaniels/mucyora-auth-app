import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { VerificationStepper } from "@/components/auth/VerificationStepper";
import { LinkButton } from "@/components/ui/LinkButton";
import { RouteLoadingPanel } from "@/components/ui/RouteLoadingPanel";
import styles from "./page.module.css";

const IdentityDocumentForm = dynamic(
  () =>
    import("@/components/forms/IdentityDocumentForm").then(
      (module) => module.IdentityDocumentForm,
    ),
  {
    loading: () => (
      <RouteLoadingPanel
        title="Preparing image controls"
        description="The document preview and validation controls are loading."
      />
    ),
  },
);

export const metadata: Metadata = {
  title: {
    absolute: "Upload Identity Document | MUCYORA",
  },
  description:
    "Provide a clear identity image as part of your secure MUCYORA verification process.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function IdentityDocumentPage() {
  return (
    <AuthCard
      size="wide"
      eyebrow="Identity image"
      title="Prepare a clear identity image"
      description="Choose a non-sensitive demonstration image, review its preview, and simulate the media-validation and upload states."
      footer={
        <div className={styles.footer}>
          <LinkButton
            href="/identity-verification"
            variant="tertiary"
            icon={<ArrowLeft size={16} />}
          >
            Return to verification overview
          </LinkButton>
        </div>
      }
    >
      <div className={styles.content}>
        <VerificationStepper currentStep="document" />

        <MockModeNotice compact>
          Select only a fake or non-sensitive image. The file remains local and
          is never uploaded.
        </MockModeNotice>

        <IdentityDocumentForm />
      </div>
    </AuthCard>
  );
}
