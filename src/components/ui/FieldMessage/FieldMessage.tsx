import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./FieldMessage.module.css";

export type FieldMessageVariant = "hint" | "error" | "success" | "warning";
export interface FieldMessageProps {
  id?: string;
  variant?: FieldMessageVariant;
  children: ReactNode;
  className?: string;
}

const icons = {
  hint: Info,
  error: AlertCircle,
  success: CheckCircle2,
  warning: TriangleAlert,
};
export function FieldMessage({
  id,
  variant = "hint",
  children,
  className,
}: FieldMessageProps) {
  const Icon = icons[variant];
  return (
    <span
      id={id}
      className={cn(styles.message, styles[variant], className)}
      role={variant === "error" ? "alert" : undefined}
    >
      <Icon size={13} aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
