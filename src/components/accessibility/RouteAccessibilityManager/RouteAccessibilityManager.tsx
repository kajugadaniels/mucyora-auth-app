"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./RouteAccessibilityManager.module.css";

function getPageTitle(): string {
  const heading =
    document.querySelector<HTMLHeadingElement>("#auth-page-title");

  return (
    heading?.textContent?.trim() ||
    document.title.replace(/\s*\|\s*MUCYORA\s*$/i, "") ||
    "Authentication page"
  );
}

export function RouteAccessibilityManager() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    const frame = window.requestAnimationFrame(() => {
      const heading =
        document.querySelector<HTMLHeadingElement>("#auth-page-title");

      heading?.focus({ preventScroll: false });
      setAnnouncement(`Loaded ${getPageTitle()}.`);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <span
      className={styles.liveRegion}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </span>
  );
}
