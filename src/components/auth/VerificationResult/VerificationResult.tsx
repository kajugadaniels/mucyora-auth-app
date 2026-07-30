import type { ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { StatusIcon } from "@/components/ui/StatusIcon";
import type { VerificationResultContent } from "@/mocks/data/verification-results";
import styles from "./VerificationResult.module.css";

export interface VerificationResultProps {
  result: VerificationResultContent;
  retryLabel?: string;
  actions: ReactNode;
}

const statusVariant = {
  PASS: "success",
  RETRY: "warning",
  PENDING: "pending",
  FAIL: "error",
  UNAVAILABLE: "warning",
} as const;

const alertVariant = {
  PASS: "success",
  RETRY: "warning",
  PENDING: "info",
  FAIL: "error",
  UNAVAILABLE: "warning",
} as const;

export function VerificationResult({
  result,
  retryLabel,
  actions,
}: VerificationResultProps) {
  return (
    <div className={styles.result}>
      <StatusIcon
        variant={statusVariant[result.status]}
        size="lg"
        label={result.title}
      />

      <div className={styles.heading}>
        <span>{result.eyebrow}</span>
        <h2>{result.title}</h2>
        <p>{result.description}</p>
      </div>

      <Alert variant={alertVariant[result.status]} title={result.detailTitle}>
        {result.detail}
      </Alert>

      {retryLabel && (
        <p className={styles.retry} role="status" aria-live="polite">
          {retryLabel}
        </p>
      )}

      <dl className={styles.metadata}>
        <div>
          <dt>Demonstration status</dt>
          <dd>{result.status}</dd>
        </div>
        <div>
          <dt>Safe reason code</dt>
          <dd>{result.reasonCode}</dd>
        </div>
        <div>
          <dt>Result reference</dt>
          <dd>{result.resultReference}</dd>
        </div>
      </dl>

      <div className={styles.actions}>{actions}</div>
    </div>
  );
}
