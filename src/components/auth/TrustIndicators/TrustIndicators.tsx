import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import styles from "./TrustIndicators.module.css";

const indicators = [
  {
    icon: ShieldCheck,
    title: "Identity protected",
    description: "Sensitive steps stay within controlled MUCYORA systems.",
  },
  {
    icon: LockKeyhole,
    title: "Private by design",
    description: "Authentication pages never expose identity information publicly.",
  },
  {
    icon: BadgeCheck,
    title: "Verified ownership",
    description: "Account trust supports safer device ownership records.",
  },
];

export function TrustIndicators() {
  return (
    <div className={styles.list} aria-label="MUCYORA trust principles">
      {indicators.map(({ icon: Icon, title, description }) => (
        <div className={styles.item} key={title}>
          <span className={styles.icon} aria-hidden="true">
            <Icon size={17} />
          </span>
          <span className={styles.copy}>
            <strong>{title}</strong>
            <span>{description}</span>
          </span>
        </div>
      ))}
    </div>
  );
}