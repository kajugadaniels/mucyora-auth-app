import { ArrowRight, UserPlus } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import styles from "./LandingActions.module.css";

export function LandingActions() {
  return (
    <div className={styles.actions}>
      <LinkButton
        href="/login"
        icon={<ArrowRight size={16} />}
        iconPosition="right"
        fullWidth
      >
        Sign in securely
      </LinkButton>

      <LinkButton
        href="/create-account"
        variant="secondary"
        icon={<UserPlus size={16} />}
        fullWidth
      >
        Create an account
      </LinkButton>
    </div>
  );
}
