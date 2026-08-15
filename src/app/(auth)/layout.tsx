import type { ReactNode } from "react";
import { RouteAccessibilityManager } from "@/components/accessibility/RouteAccessibilityManager/RouteAccessibilityManager";
import { AuthShell } from "@/components/auth/AuthShell";
import styles from "./layout.module.css";

export default function AuthRouteGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className={styles.routeGroup}>
      <RouteAccessibilityManager />
      <AuthShell>{children}</AuthShell>
    </div>
  );
}
