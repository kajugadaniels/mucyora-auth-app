"use client";

import { Check } from "lucide-react";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { cn } from "@/lib/utils/cn";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: ReactNode;
  description?: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { id, label, description, error, className, ...props },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className={cn(styles.wrapper, className)}>
        <label
          className={cn(styles.label, props.disabled && styles.disabled)}
          htmlFor={inputId}
        >
          <span className={styles.control}>
            <input
              ref={ref}
              id={inputId}
              type="checkbox"
              className={styles.input}
              aria-invalid={Boolean(error)}
              aria-describedby={
                [descriptionId, errorId].filter(Boolean).join(" ") || undefined
              }
              {...props}
            />
            <span className={styles.box} aria-hidden="true">
              <Check size={13} strokeWidth={3} />
            </span>
          </span>
          <span className={styles.copy}>
            <span className={styles.title}>{label}</span>
            {description && (
              <span id={descriptionId} className={styles.description}>
                {description}
              </span>
            )}
          </span>
        </label>
        {error && (
          <FieldMessage id={errorId} variant="error">
            {error}
          </FieldMessage>
        )}
      </div>
    );
  },
);
