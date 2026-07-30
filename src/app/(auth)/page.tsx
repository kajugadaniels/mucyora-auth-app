import {
  Agreement01Icon,
  Certificate01Icon,
  DocumentValidationIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { LandingActions } from "@/components/auth/LandingActions";
import { MockModeNotice } from "@/components/auth/MockModeNotice";
import { SecurityNotice } from "@/components/auth/SecurityNotice";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "Secure Access to MUCYORA | Sign In or Create an Account",
  },
  description:
    "Sign in to MUCYORA or prepare a verified account to securely register devices, manage ownership, and complete trusted digital agreements.",
};

const capabilities = [
  {
    icon: DocumentValidationIcon,
    title: "Verified device records",
    description: "Connect devices to trusted ownership information.",
  },
  {
    icon: Certificate01Icon,
    title: "Protected ownership",
    description: "Use verified identity for safer ownership changes.",
  },
  {
    icon: Agreement01Icon,
    title: "Trusted agreements",
    description: "Prepare secure buyer and seller agreement workflows.",
  },
];

export default function AuthenticationHomePage() {
  return (
    <AuthCard
      size="wide"
      eyebrow="MUCYORA authentication"
      title="Secure access starts here"
      description="Sign in to continue or prepare to create a verified MUCYORA account. This static interface demonstrates the experience before backend integration."
    >
      <div className={styles.content}>
        <div className={styles.capabilities}>
          {capabilities.map(({ icon, title, description }) => (
            <article className={styles.capability} key={title}>
              <span className={styles.capabilityIcon} aria-hidden="true">
                <HugeiconsIcon
                  icon={icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>

        <LandingActions />

        <SecurityNotice>
          MUCYORA authentication pages are designed to keep credentials and
          identity information private. The current static build does not
          transmit or store any information.
        </SecurityNotice>

        <MockModeNotice compact />
      </div>
    </AuthCard>
  );
}
