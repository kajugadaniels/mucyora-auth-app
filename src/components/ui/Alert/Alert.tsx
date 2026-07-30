import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "error";
export interface AlertProps {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}
const icons: Record<AlertVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};
export function Alert({
  variant = "info",
  title,
  children,
  action,
  className,
}: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      className={cn(styles.alert, styles[variant], className)}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon size={18} />
      </span>
      <div className={styles.content}>
        <strong>{title}</strong>
        {children && <div className={styles.body}>{children}</div>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
}
