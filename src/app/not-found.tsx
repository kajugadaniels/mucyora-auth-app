import { ArrowLeft, SearchX, ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          <SearchX size={26} />
        </span>
        <span className={styles.code}>404</span>
        <h1>Authentication page not found</h1>
        <p>
          The page may have moved, the link may be incomplete, or the requested
          authentication state may no longer be available.
        </p>
        <div className={styles.notice}>
          <ShieldCheck size={17} aria-hidden="true" />
          <span>
            No account, credential, or verification information was exposed.
          </span>
        </div>
        <div className={styles.actions}>
          <LinkButton href="/" icon={<ArrowLeft size={16} />}>
            Authentication home
          </LinkButton>
          <LinkButton
            href="/login"
            variant="secondary"
            icon={<ShieldCheck size={16} />}
          >
            Open secure sign in
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
