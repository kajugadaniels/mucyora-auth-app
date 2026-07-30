import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Info,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./StatusIcon.module.css";

export type StatusIconVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "pending";
export interface StatusIconProps {
  variant: StatusIconVariant;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
const icons: Record<StatusIconVariant, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: ShieldAlert,
  info: Info,
  pending: Clock3,
};
export function StatusIcon({
  variant,
  label,
  size = "md",
  className,
}: StatusIconProps) {
  const Icon = icons[variant];
  return (
    <span
      className={cn(styles.icon, styles[variant], styles[size], className)}
      role="img"
      aria-label={label}
    >
      <Icon aria-hidden="true" />
    </span>
  );
}