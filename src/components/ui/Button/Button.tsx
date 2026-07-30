"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils/cn";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      isLoading = false,
      loadingText = "Please wait",
      fullWidth = false,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) {
    const contentIcon = isLoading ? (
      <LoadingSpinner size="sm" label={loadingText} />
    ) : (
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    );
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          fullWidth && styles.fullWidth,
          className,
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {iconPosition === "left" && contentIcon}
        <span className={styles.label}>
          {isLoading ? loadingText : children}
        </span>
        {iconPosition === "right" && contentIcon}
      </button>
    );
  },
);
