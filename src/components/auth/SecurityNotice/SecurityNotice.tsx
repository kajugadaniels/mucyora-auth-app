import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./SecurityNotice.module.css";

export interface SecurityNoticeProps {
  title?: string;
  children: ReactNode;
}

export function SecurityNotice({
  title = "Your information stays protected",
  children,
}: SecurityNoticeProps) {
  return (
    <aside className={styles.notice}>
      <span className={styles.icon} aria-hidden="true">
        <LockKeyhole size={17} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}