import { Camera, Check, FileImage, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./VerificationStepper.module.css";

export type VerificationStep =
  | "introduction"
  | "document"
  | "live-check"
  | "result";

export interface VerificationStepperProps {
  currentStep: VerificationStep;
}

const steps = [
  {
    key: "introduction",
    label: "Prepare",
    icon: ShieldCheck,
  },
  {
    key: "document",
    label: "Identity image",
    icon: FileImage,
  },
  {
    key: "live-check",
    label: "Live check",
    icon: Camera,
  },
  {
    key: "result",
    label: "Result",
    icon: Check,
  },
] as const;

export function VerificationStepper({ currentStep }: VerificationStepperProps) {
  const activeIndex = steps.findIndex(({ key }) => key === currentStep);

  return (
    <nav className={styles.stepper} aria-label="Identity verification progress">
      <ol>
        {steps.map(({ key, label, icon: Icon }, index) => {
          const completed = index < activeIndex;
          const current = index === activeIndex;

          return (
            <li
              className={cn(
                styles.step,
                completed && styles.completed,
                current && styles.current,
              )}
              key={key}
              aria-current={current ? "step" : undefined}
            >
              <span className={styles.marker} aria-hidden="true">
                {completed ? <Check size={15} /> : <Icon size={15} />}
              </span>

              <span className={styles.label}>
                <span>Step {index + 1}</span>
                <strong>{label}</strong>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
