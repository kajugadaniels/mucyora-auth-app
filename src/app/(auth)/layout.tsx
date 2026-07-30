import type { ReactNode } from "react";
import { RouteAccessibilityManager } from "@/components/accessibility/RouteAccessibilityManager";
import { AuthShell } from "@/components/auth/AuthShell";
import { SonnerProvider } from "@/components/ui/SonnerProvider";
import styles from "./layout.module.css";

export default function AuthRouteGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className={styles.routeGroup}>
      <RouteAccessibilityManager />
      <AuthShell>{children}</AuthShell>
      <SonnerProvider />
    </div>
  );
}
