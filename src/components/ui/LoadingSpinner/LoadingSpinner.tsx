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
      <span className={styles.globe} aria-hidden="true">
        <span className={styles.meridianWrap}>
          <span className={styles.meridian} />
        </span>
        <span className={styles.meridianWrap}>
          <span className={styles.meridian} />
        </span>
        <span className={styles.meridianWrap}>
          <span className={styles.meridian} />
        </span>
      </span>
      <span className={styles.orbit} aria-hidden="true">
        <span className={styles.orbitDot} />
      </span>
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  );
}