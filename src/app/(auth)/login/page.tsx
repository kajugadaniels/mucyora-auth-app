import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: "Sign In to MUCYORA",
  },
  description:
    "Access your secure MUCYORA account to manage verified devices, ownership records, and trusted digital transactions.",
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <header className={styles.heading}>
            <span className={styles.eyebrow}>Welcome back</span>
            <h1 id="auth-page-title" tabIndex={-1}>
              Sign in
            </h1>
            <p id="auth-page-description">
              Enter your account credentials to create a protected MUCYORA
              session.
            </p>
          </header>

          <LoginForm />

          <p className={styles.createAccount}>
            Need a MUCYORA account?{" "}
            <Link href="/create-account" className={styles.createAccountLink}>
              Create an account
            </Link>
          </p>
        </div>

        <footer className={styles.legalFooter}>
          <Link href="/privacy">Privacy</Link>
          <span className={styles.dot} aria-hidden="true" />
          <Link href="/terms">Terms &amp; Conditions</Link>
          <span className={styles.dot} aria-hidden="true" />
          <Link href="/help">Help Center</Link>
        </footer>
      </div>

      <div
        className={styles.imageSide}
        role="img"
        aria-label="MUCYORA secure identity platform"
      />
    </div>
  );
}