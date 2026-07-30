import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import styles from "./AuthHeader.module.css";

export function AuthHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.mobileBrand} aria-label="MUCYORA authentication home">
        <Image src="/brand/logo-full.svg" width={148} height={38} alt="MUCYORA" priority />
      </Link>

      <Badge variant="primary" icon={<ShieldCheck />}>
        Secure authentication
      </Badge>
    </header>
  );
}