"use client";

import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { cn } from "@/lib/utils/cn";
import styles from "./SelectField.module.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: ReactNode;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  optionalLabel?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      id,
      label,
      icon,
      options,
      placeholder = "Select an option",
      error,
      hint,
      optionalLabel,
      className,
      required,
      disabled,
      value,
      defaultValue,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId, !error ? hintId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    const selectionProps =
      value !== undefined ? { value } : { defaultValue: defaultValue ?? "" };

    return (
      <div className={cn(styles.field, className)}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor={selectId}>
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
            disabled && styles.controlDisabled,
          )}
        >
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
          <select
            ref={ref}
            id={selectId}
            className={styles.select}
            required={required}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            {...selectionProps}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={styles.chevron}
            size={16}
            aria-hidden="true"
          />
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
  },
);
