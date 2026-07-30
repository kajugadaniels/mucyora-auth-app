import { FlaskConical } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./MockModeNotice.module.css";

export interface MockModeNoticeProps {
  children?: ReactNode;
  compact?: boolean;
}

export function MockModeNotice({ children, compact = false }: MockModeNoticeProps) {
  return (
    <aside className={compact ? styles.compact : styles.notice} role="note">
      <span className={styles.icon} aria-hidden="true">
        <FlaskConical size={16} />
      </span>
      <div>
        <strong>Static demonstration</strong>
        <p>
          {children ??
            "This interface uses local mock behavior. It does not contact NIDA, the Auth API, email services, or the biometric Engine."}
        </p>
      </div>
    </aside>
  );
}