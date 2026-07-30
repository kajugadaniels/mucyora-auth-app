import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
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

      <aside className={styles.brandPanel} aria-label="About MUCYORA">
        <AuthBrandPanel />
      </aside>

      <section className={styles.formPanel}>
        <AuthHeader />
        <main id="auth-main" className={styles.main} tabIndex={-1}>
          {children}
        </main>
        <FormFooter />
      </section>
    </div>
  );
}