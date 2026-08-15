"use client";

import {
  Alert02Icon,
  Home01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
          <HugeiconsIcon
            icon={Alert02Icon}
            size={26}
            color="currentColor"
            strokeWidth={1.8}
          />
        </span>

        <span className={styles.eyebrow}>Interface recovery</span>

        <h1>Something did not load correctly</h1>

        <p>
          Try rendering the page again or return to the secure authentication
          entry. Sensitive authentication values are not retained on this
          error page.
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
          <Button
            icon={
              <HugeiconsIcon
                icon={RefreshIcon}
                size={16}
                color="currentColor"
                strokeWidth={1.8}
              />
            }
            onClick={reset}
          >
            Try again
          </Button>

          <LinkButton
            href="/"
            variant="secondary"
            icon={
              <HugeiconsIcon
                icon={Home01Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.8}
              />
            }
          >
            Authentication home
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
