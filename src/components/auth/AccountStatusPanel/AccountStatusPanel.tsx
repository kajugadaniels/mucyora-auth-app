import type { ReactNode } from "react";
import { Alert, type AlertVariant } from "@/components/ui/Alert";
import { StatusIcon, type StatusIconVariant } from "@/components/ui/StatusIcon";
import styles from "./AccountStatusPanel.module.css";

export interface AccountStatusDetail {
  label: string;
  value: string;
}

export interface AccountStatusPanelProps {
  iconVariant: StatusIconVariant;
  iconLabel: string;
  alertVariant: AlertVariant;
  alertTitle: string;
  alertMessage: string;
  details: AccountStatusDetail[];
  actions: ReactNode;
}

export function AccountStatusPanel({
  iconVariant,
  iconLabel,
  alertVariant,
  alertTitle,
  alertMessage,
  details,
  actions,
}: AccountStatusPanelProps) {
  return (
    <div className={styles.panel}>
      <StatusIcon variant={iconVariant} label={iconLabel} size="lg" />
      <Alert variant={alertVariant} title={alertTitle}>
        {alertMessage}
      </Alert>
      <dl className={styles.details}>
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
