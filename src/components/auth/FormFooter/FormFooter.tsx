import { siteConfig } from "@/config/site.config";
import styles from "./FormFooter.module.css";

export function FormFooter() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} {siteConfig.name}. Secure access for trusted ownership.</p>
      <div className={styles.links} aria-label="Authentication information">
        <span>Privacy</span>
        <span aria-hidden="true">•</span>
        <span>Terms</span>
        <span aria-hidden="true">•</span>
        <span>Help</span>
      </div>
    </footer>
  );
}