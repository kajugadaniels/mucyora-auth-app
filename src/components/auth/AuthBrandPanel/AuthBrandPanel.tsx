"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { getAuthBrandContent } from "@/content/auth-copy";
import { TrustIndicators } from "@/components/auth/TrustIndicators";
import styles from "./AuthBrandPanel.module.css";

export function AuthBrandPanel() {
  const pathname = usePathname();
  const content = getAuthBrandContent(pathname);

  return (
    <div className={styles.panel}>
      <div className={styles.brand}>
        <Image
          src="/brand/logo-full.svg"
          width={174}
          height={44}
          alt="MUCYORA"
          priority
          className={styles.logo}
        />
      </div>

      <div className={styles.copy}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h2>{content.title}</h2>
        <p>{content.description}</p>
      </div>

      <div className={styles.illustration}>
        <Image
          src={content.illustration}
          width={520}
          height={380}
          alt={content.illustrationAlt}
          priority={pathname === "/"}
        />
      </div>

      <TrustIndicators />
    </div>
  );
}
