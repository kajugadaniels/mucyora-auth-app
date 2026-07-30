"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils/cn";
import styles from "./IconButton.module.css";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  variant?: "plain" | "soft" | "bordered" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      label,
      icon,
      variant = "plain",
      size = "md",
      isLoading = false,
      className,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(styles.button, styles[variant], styles[size], className)}
        aria-label={label}
        aria-busy={isLoading}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner size="sm" label={label} />
        ) : (
          <span aria-hidden="true">{icon}</span>
        )}
      </button>
    );
  },
);
