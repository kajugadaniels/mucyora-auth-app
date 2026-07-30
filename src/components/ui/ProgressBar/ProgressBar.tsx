import { cn } from "@/lib/utils/cn";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps {
  value: number;
  label: string;
  showValue?: boolean;
  size?: "sm" | "md";
  className?: string;
}
export function ProgressBar({
  value,
  label,
  showValue = false,
  size = "md",
  className,
}: ProgressBarProps) {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.labelRow}>
        <span>{label}</span>
        {showValue && <span>{Math.round(normalized)}%</span>}
      </div>
      <div
        className={cn(styles.track, styles[size])}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalized}
      >
        <span className={styles.fill} style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
