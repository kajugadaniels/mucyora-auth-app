import type { ReactNode } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormFooter } from "@/components/auth/FormFooter";
import styles from "./AuthShell.module.css";

export interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#auth-main">
        Skip to authentication content
      </a>

      <section className={styles.formPanel}>
        <AuthHeader />

        <main id="auth-main" className={styles.main} tabIndex={-1}>
          <div className={styles.mainContent}>{children}</div>
        </main>

        <FormFooter />
      </section>
    </div>
  );
}
