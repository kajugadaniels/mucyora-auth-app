import styles from "./LoadingSpinner.module.css";
import { cn } from "@/lib/utils/cn";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  label = "Loading",
  className,
}: LoadingSpinnerProps) {
  return (
    <span
      className={cn(styles.spinner, styles[size], className)}
      role="status"
      aria-label={label}
    >
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  );
}
