"use client";

import { KeyRound } from "lucide-react";
import {
  useId,
  useMemo,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { cn } from "@/lib/utils/cn";
import styles from "./OtpInput.module.css";

export interface OtpInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  length?: number;
  error?: string;
  hint?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  label,
  value,
  onChange,
  length = 6,
  error,
  hint,
  disabled = false,
  autoFocus = false,
}: OtpInputProps) {
  const id = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const values = useMemo(
    () => Array.from({ length }, (_, index) => value[index] ?? ""),
    [length, value],
  );

  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  function setAt(index: number, digit: string) {
    const next = [...values];
    next[index] = digit;
    onChange(next.join("").slice(0, length));
  }

  function change(index: number, input: string) {
    const digit = input.replace(/\D/g, "").slice(-1);
    setAt(index, digit);

    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function keyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function paste(event: ClipboardEvent<HTMLDivElement>) {
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!digits) {
      return;
    }

    event.preventDefault();
    onChange(digits);
    refs.current[Math.min(digits.length, length) - 1]?.focus();
  }

  return (
    <fieldset className={styles.fieldset} aria-describedby={descriptionId}>
      <legend className={styles.legend}>
        <KeyRound size={15} aria-hidden="true" />
        {label}
      </legend>

      <div className={styles.inputs} onPaste={paste}>
        {values.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            className={cn(styles.input, error && styles.inputError)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`${label}, digit ${index + 1} of ${length}`}
            aria-invalid={Boolean(error)}
            aria-describedby={descriptionId}
            onChange={(event) => change(index, event.target.value)}
            onKeyDown={(event) => keyDown(index, event)}
          />
        ))}
      </div>

      {error ? (
        <FieldMessage id={`${id}-error`} variant="error">
          {error}
        </FieldMessage>
      ) : hint ? (
        <FieldMessage id={`${id}-hint`}>{hint}</FieldMessage>
      ) : null}
    </fieldset>
  );
}
