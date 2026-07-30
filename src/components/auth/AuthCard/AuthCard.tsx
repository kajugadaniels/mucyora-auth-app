import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./AuthCard.module.css";

export type AuthCardSize = "standard" | "wide";

export interface AuthCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: AuthCardSize;
  className?: string;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
  size = "standard",
  className,
}: AuthCardProps) {
  return (
    <section
      className={cn(styles.card, styles[size], className)}
      aria-labelledby="auth-page-title"
      aria-describedby={description ? "auth-page-description" : undefined}
    >
      <header className={styles.heading}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}

        <h1 id="auth-page-title" tabIndex={-1}>
          {title}
        </h1>

        {description && <p id="auth-page-description">{description}</p>}
      </header>

      <div className={styles.content}>{children}</div>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </section>
  );
}
