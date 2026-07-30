import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./LinkButton.module.css";

export interface LinkButtonProps
  extends LinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  children: ReactNode;
  icon: ReactNode;
  iconPosition?: "left" | "right";
  variant?: "primary" | "secondary" | "tertiary";
  fullWidth?: boolean;
}
export function LinkButton({
  children,
  icon,
  iconPosition = "left",
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        styles.link,
        styles[variant],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...props}
    >
      {iconPosition === "left" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
      {iconPosition === "right" && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </Link>
  );
}
