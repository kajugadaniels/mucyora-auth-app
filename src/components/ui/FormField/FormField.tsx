import type { ReactNode } from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { cn } from "@/lib/utils/cn";
import styles from "./FormField.module.css";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  hintId?: string;
  errorId?: string;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  children,
  required,
  optionalLabel = "Optional",
  hint,
  error,
  hintId,
  errorId,
  className,
}: FormFieldProps) {
  return (
    <div className={cn(styles.field, className)}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        {!required && optionalLabel && (
          <span className={styles.optional}>{optionalLabel}</span>
        )}
      </div>
      {children}
      {error ? (
        <FieldMessage id={errorId} variant="error">
          {error}
        </FieldMessage>
      ) : hint ? (
        <FieldMessage id={hintId}>{hint}</FieldMessage>
      ) : null}
    </div>
  );
}
