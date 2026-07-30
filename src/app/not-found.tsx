import {
  ArrowLeft01Icon,
  Search01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <HugeiconsIcon
            icon={Search01Icon}
            size={26}
            color="currentColor"
            strokeWidth={1.8}
          />
        </span>

        <span className={styles.code}>404</span>

        <h1>Authentication page not found</h1>

        <p>
          The page may have moved, the link may be incomplete, or the requested
          authentication state may no longer be available.
        </p>

        <div className={styles.notice}>
          <HugeiconsIcon
            icon={Shield01Icon}
            size={17}
            color="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span>
            No account, credential, or verification information was exposed.
          </span>
        </div>

        <div className={styles.actions}>
          <LinkButton
            href="/"
            icon={
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.8}
              />
            }
          >
            Authentication home
          </LinkButton>

          <LinkButton
            href="/login"
            variant="secondary"
            icon={
              <HugeiconsIcon
                icon={Shield01Icon}
                size={16}
                color="currentColor"
                strokeWidth={1.8}
              />
            }
          >
            Open secure sign in
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
