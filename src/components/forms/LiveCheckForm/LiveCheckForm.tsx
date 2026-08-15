"use client";
import { Camera, Headphones } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { authFlowState, authGateway, isAuthGatewayError } from "@/services/auth";
import { openCaptureProvider } from "@/services/auth/provider-bridge";
import styles from "./LiveCheckForm.module.css";
export function LiveCheckForm() {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState<string>();
  const capture = async () => {
    setBusy(true); setError(undefined);
    try {
      const attemptId = authFlowState().attemptId; if (!attemptId) return router.replace("/identity-verification/document");
      const session = await authGateway.createLivenessSession(attemptId);
      await openCaptureProvider("liveness", session.sessionId);
      const result = await authGateway.submitIdentityAttempt(attemptId);
      if (result.nextAction === "LOGIN" && result.redirectUrl) { window.location.assign(result.redirectUrl); return; }
      router.replace("/identity-verification/result");
    } catch (caught) { setError(isAuthGatewayError(caught) ? caught.message : caught instanceof Error ? caught.message : "Live verification could not be completed."); }
    finally { setBusy(false); }
  };
  const review = async () => {
    const attemptId = authFlowState().attemptId; if (!attemptId) return router.replace("/identity-verification/document");
    setBusy(true); setError(undefined);
    try { await authGateway.requestManualReview(attemptId, "ACCESSIBILITY_ASSISTANCE"); router.replace("/identity-verification/result"); }
    catch (caught) { setError(isAuthGatewayError(caught) ? caught.message : "Manual review could not be requested."); }
    finally { setBusy(false); }
  };
  return <div className={styles.form}>
    {error && <Alert variant="error" title="Live verification not completed">{error}</Alert>}
    <Alert variant="info" title="Live face capture">The approved liveness provider opens your camera directly. Existing photos and file uploads are not accepted.</Alert>
    <Button icon={<Camera size={16} />} isLoading={busy} loadingText="Opening secure live check" onClick={() => void capture()} fullWidth>Start live face check</Button>
    <Button variant="secondary" icon={<Headphones size={16} />} disabled={busy} onClick={() => void review()} fullWidth>Request accessibility review</Button>
  </div>;
}
