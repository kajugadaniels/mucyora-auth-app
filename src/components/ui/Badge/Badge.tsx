import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Badge.module.css";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "error";
export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}
export function Badge({
  children,
  variant = "neutral",
  icon,
  className,
}: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
