"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./error.module.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Authentication UI boundary error", error);
    }
  }, [error]);

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <AlertTriangle size={26} />
        </span>
        <span className={styles.eyebrow}>Interface recovery</span>
        <h1>Something did not load correctly</h1>
        <p>
          Try rendering the page again or return to the secure authentication
          entry. No authentication information was submitted by this static
          interface.
        </p>
        {error.digest && (
          <dl className={styles.reference}>
            <div>
              <dt>Safe error reference</dt>
              <dd>{error.digest}</dd>
            </div>
          </dl>
        )}
        <div className={styles.actions}>
          <Button icon={<RotateCcw size={16} />} onClick={reset}>
            Try again
          </Button>
          <LinkButton href="/" variant="secondary" icon={<Home size={16} />}>
            Authentication home
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
