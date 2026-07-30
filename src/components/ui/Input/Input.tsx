"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { cn } from "@/lib/utils/cn";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: ReactNode;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  rightAction?: ReactNode;
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    icon,
    error,
    hint,
    optionalLabel,
    rightAction,
    className,
    required,
    hideLabel = false,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, errorId, !error ? hintId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn(styles.field, className)}>
      <div className={cn(styles.labelRow, hideLabel && styles.visuallyHidden)}>
        <label className={styles.label} htmlFor={inputId}>
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
      <div
        className={cn(
          styles.control,
          error && styles.controlError,
          props.disabled && styles.controlDisabled,
        )}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        />
        {rightAction && (
          <span className={styles.rightAction}>{rightAction}</span>
        )}
      </div>
      {error ? (
        <FieldMessage id={errorId} variant="error">
          {error}
        </FieldMessage>
      ) : hint ? (
        <FieldMessage id={hintId}>{hint}</FieldMessage>
      ) : null}
    </div>
  );
});
