import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Divider.module.css";

export interface DividerProps {
  label?: ReactNode;
  className?: string;
}
export function Divider({ label, className }: DividerProps) {
  return (
    <div className={cn(styles.divider, className)} role="separator">
      {label ? (
        <>
          <span className={styles.line} />
          <span className={styles.label}>{label}</span>
          <span className={styles.line} />
        </>
      ) : (
        <span className={styles.line} />
      )}
    </div>
  );
}
