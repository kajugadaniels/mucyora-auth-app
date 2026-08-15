"use client";
import { Camera, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { authFlowState, authGateway, isAuthGatewayError } from "@/services/auth";
import { openCaptureProvider } from "@/services/auth/provider-bridge";
import styles from "./IdentityDocumentForm.module.css";
export function IdentityDocumentForm() {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState<string>();
  const capture = async () => {
    setBusy(true); setError(undefined);
    try {
      const state = authFlowState(); const attempt = state.attemptId ? await authGateway.identityAttempt(state.attemptId) : await authGateway.createIdentityAttempt();
      const session = await authGateway.createDocumentCaptureSession(attempt.id);
      await openCaptureProvider("document", session.sessionId, session.clientToken);
      let completion = await authGateway.completeDocumentCapture(attempt.id);
      for (let count = 0; completion.status === "PENDING" && count < 5; count += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 1_500)); completion = await authGateway.completeDocumentCapture(attempt.id);
      }
      if (completion.status !== "CONFIRMED") throw new Error("Document capture is still being processed. Please try again shortly.");
      router.push("/identity-verification/live-check");
    } catch (caught) { setError(isAuthGatewayError(caught) ? caught.message : caught instanceof Error ? caught.message : "Document capture could not be completed."); }
    finally { setBusy(false); }
  };
  return <div className={styles.form}>
    {error && <Alert variant="error" title="Document capture not completed">{error}</Alert>}
    <Alert variant="info" title="Live camera capture only">MUCYORA does not accept uploaded ID images. The approved capture provider will open a protected camera session.</Alert>
    <div className={styles.actions}><Button icon={<Camera size={16} />} isLoading={busy} loadingText="Opening secure capture" onClick={() => void capture()} fullWidth>Capture National ID live</Button></div>
    <p className={styles.privacy}><ShieldCheck size={15} aria-hidden="true" />The provider token is short-lived and bound to this verification attempt. MUCYORA confirms evidence directly with the provider.</p>
  </div>;
}
