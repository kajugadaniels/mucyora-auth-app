"use client";

import {
  forwardRef,
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { cn } from "@/lib/utils/cn";
import styles from "./TextareaField.module.css";

export interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon: ReactNode;
  error?: string;
  hint?: string;
  optionalLabel?: string;
  showCharacterCount?: boolean;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(function TextareaField(
  {
    id,
    label,
    icon,
    error,
    hint,
    optionalLabel,
    showCharacterCount = false,
    value,
    defaultValue,
    maxLength,
    className,
    required,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, errorId, !error ? hintId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const length =
    typeof value === "string"
      ? value.length
      : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;
  return (
    <div className={cn(styles.field, className)}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={fieldId}>
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
      <div className={cn(styles.control, error && styles.controlError)}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        <textarea
          ref={ref}
          id={fieldId}
          className={styles.textarea}
          required={required}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        />
      </div>
      <div className={styles.messageRow}>
        {error ? (
          <FieldMessage id={errorId} variant="error">
            {error}
          </FieldMessage>
        ) : hint ? (
          <FieldMessage id={hintId}>{hint}</FieldMessage>
        ) : (
          <span />
        )}
        {showCharacterCount && maxLength ? (
          <span className={styles.counter} aria-live="polite">
            {length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
});