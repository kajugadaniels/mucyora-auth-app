"use client";
import { LogIn, RefreshCw } from "lucide-react";
import { VerificationResult } from "@/components/auth/VerificationResult";
import { Alert } from "@/components/ui/Alert";
import { LinkButton } from "@/components/ui/LinkButton";
import { authFlowState } from "@/services/auth";
import styles from "./VerificationResultExperience.module.css";
export function VerificationResultExperience() {
  const result = authFlowState().result;
  if (!result) return <Alert variant="warning" title="Verification result unavailable">Return to identity verification to resume your protected attempt.</Alert>;
  const retry = result.nextAction === "RETRY_IDENTITY_VERIFICATION" || result.nextAction === "WAIT_FOR_PROVIDER";
  return <div className={styles.experience}><VerificationResult result={result} actions={retry ? <LinkButton href="/identity-verification/document" icon={<RefreshCw size={16} />}>Retry identity verification</LinkButton> : <LinkButton href="/login" icon={<LogIn size={16} />}>Return to sign in</LinkButton>} /></div>;
}
