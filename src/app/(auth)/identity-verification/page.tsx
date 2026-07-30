import {
  ArrowRight01Icon,
  Clock01Icon,
  LockKeyIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { IdentityGuide } from "@/components/auth/IdentityGuide";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import { VerificationStepper } from "@/components/auth/VerificationStepper";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "Verify Your Identity | MUCYORA",
  },
  description:
    "Complete secure identity verification to activate trusted MUCYORA account features.",
  robots: {
    index: false,
    follow: false,
  },
};

const processDetails = [
  {
    icon: Shield01Icon,
    title: "Identity image",
    text: "Prepare a clear identity image for controlled private validation.",
  },
  {
    icon: LockKeyIcon,
    title: "Guided live check",
    text: "Complete a short live-face step that will later use the protected biometric Engine.",
  },
  {
    icon: Clock01Icon,
    title: "Clear result",
    text: "Receive a safe status and the correct next action without exposing sensitive thresholds.",
  },
];

export default function IdentityVerificationPage() {
  return (
    <AuthCard
      size="wide"
      eyebrow="Identity verification"
      title="Prepare for a secure identity check"
      description="Review the steps, privacy protections, and capture guidance before continuing. Everything remains static until backend integration."
    >
      <div className={styles.content}>
        <VerificationStepper currentStep="introduction" />

        <MockModeNotice compact>
          This demonstration does not open a camera, upload an image, call NIDA,
          or send evidence to the MUCYORA Engine.
        </MockModeNotice>

        <div className={styles.process}>
          {processDetails.map(({ icon, title, text }) => (
            <article className={styles.processItem} key={title}>
              <span className={styles.processIcon} aria-hidden="true">
                <HugeiconsIcon
                  icon={icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>

        <IdentityGuide />

        <SecurityNotice>
          Identity images and live verification evidence are sensitive. The
          future integrated flow will use private, attempt-bound storage, strict
          retention, and authenticated service calls.
        </SecurityNotice>

        <LinkButton
          href="/identity-verification/document"
          icon={
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.8}
            />
          }
          iconPosition="right"
          fullWidth
        >
          Continue to identity image
        </LinkButton>
      </div>
    </AuthCard>
  );
}