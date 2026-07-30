import { Check } from "lucide-react";
import type { RegistrationStep } from "@/state/registration-flow.types";
import { cn } from "@/lib/utils/cn";
import styles from "./RegistrationStepper.module.css";

const steps: Array<{ key: RegistrationStep; label: string }> = [
  { key: "CITIZEN_LOOKUP", label: "National ID" },
  { key: "CITIZEN_REVIEW", label: "Review" },
  { key: "CREDENTIALS", label: "Account" },
  { key: "CONSENT", label: "Consent" },
];

const stepIndex: Record<RegistrationStep, number> = {
  CITIZEN_LOOKUP: 0,
  CITIZEN_REVIEW: 1,
  CREDENTIALS: 2,
  CONSENT: 3,
  COMPLETE: 4,
};

export interface RegistrationStepperProps {
  currentStep: RegistrationStep;
}

export function RegistrationStepper({ currentStep }: RegistrationStepperProps) {
  const currentIndex = stepIndex[currentStep];

  return (
    <nav className={styles.stepper} aria-label="Account creation progress">
      <ol>
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.key}
              className={cn(
                styles.step,
                isComplete && styles.complete,
                isCurrent && styles.current,
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className={styles.marker} aria-hidden="true">
                {isComplete ? <Check size={14} strokeWidth={3} /> : index + 1}
              </span>
              <span className={styles.label}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
