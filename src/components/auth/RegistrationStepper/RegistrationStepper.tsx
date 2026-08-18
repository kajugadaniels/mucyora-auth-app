import { Check } from "lucide-react";
import type { RegistrationStep } from "@/state/registration-flow.types";
import { cn } from "@/lib/utils/cn";
import styles from "./RegistrationStepper.module.css";

const steps: Array<{ key: RegistrationStep; label: string }> = [
  { key: "CITIZEN_LOOKUP", label: "National ID" },
  { key: "CREDENTIALS", label: "Account" },
  { key: "CONSENT", label: "Consent" },
];

const stepIndex: Record<RegistrationStep, number> = {
  CITIZEN_LOOKUP: 0,
  CREDENTIALS: 1,
  CONSENT: 2,
  COMPLETE: 3,
};

export interface RegistrationStepperProps {
  currentStep: RegistrationStep;
}

export function RegistrationStepper({ currentStep }: RegistrationStepperProps) {
  const currentIndex = stepIndex[currentStep];
  const displayStep = Math.min(currentIndex + 1, steps.length);

  return (
    <nav className={styles.stepper} aria-label="Account creation progress">
      <div className={styles.summary} aria-live="polite">
        <span className={styles.summaryLabel}>Secure registration</span>
        <span className={styles.summaryValue}>
          Step {displayStep} of {steps.length}
        </span>
      </div>
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
