import type { ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { StatusIcon } from "@/components/ui/StatusIcon";
import type { VerificationSubmission } from "@/services/auth";
import styles from "./VerificationResult.module.css";
export function VerificationResult({ result, actions }: { result: VerificationSubmission; actions: ReactNode }) {
  const passed = result.nextAction === "LOGIN" || result.nextAction === "STEP_UP_COMPLETED";
  const pending = result.nextAction === "WAIT_FOR_REVIEW" || result.nextAction === "WAIT_FOR_PROVIDER";
  return <div className={styles.result}>
    <StatusIcon variant={passed ? "success" : pending ? "pending" : "warning"} size="lg" label={result.status} />
    <div className={styles.heading}><span>Identity verification</span><h2>{result.status}</h2><p>Your verification request was processed under policy {result.policyVersion}.</p></div>
    <Alert variant={passed ? "success" : pending ? "info" : "warning"} title={result.nextAction.replaceAll("_", " ")}>{result.reasonCode || "Follow the next action shown below."}</Alert>
    <dl className={styles.metadata}><div><dt>Status</dt><dd>{result.status}</dd></div><div><dt>Reason code</dt><dd>{result.reasonCode || "NOT_PROVIDED"}</dd></div><div><dt>Attempt</dt><dd>{result.attemptNumber}</dd></div></dl>
    <div className={styles.actions}>{actions}</div>
  </div>;
}
