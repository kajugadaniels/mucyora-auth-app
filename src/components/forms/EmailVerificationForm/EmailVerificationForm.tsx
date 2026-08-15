"use client";
import { Mail, MailCheck, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCountdown } from "@/hooks/useCountdown";
import { useSubmission } from "@/hooks/useSubmission";
import { authFlowState, authGateway, isAuthGatewayError } from "@/services/auth";
import styles from "./EmailVerificationForm.module.css";

interface ResendValues { email: string; }
export function EmailVerificationForm() {
  const router = useRouter(); const verification = useSubmission(); const resend = useSubmission(); const countdown = useCountdown(0);
  const token = useSearchParams().get("token") || undefined; const [error, setError] = useState<string>(); const [accepted, setAccepted] = useState(false);
  const { register, handleSubmit, formState: { errors }, setError: setFieldError } = useForm<ResendValues>({ defaultValues: { email: authFlowState().registrationEmail || "" } });
  useEffect(() => {
    if (!token) return; const url = new URL(window.location.href); url.searchParams.delete("token"); window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [token]);
  const verify = async () => {
    if (!token) return;
    setError(undefined);
    try {
      const result = await verification.run(() => authGateway.verifyEmail(token)); if (!result) return;
      await authGateway.exchangeIdentitySession(result.identityEnrolmentToken);
      router.replace("/identity-verification");
    } catch (caught) { if (!isAuthGatewayError(caught)) throw caught; setError(caught.message); }
  };
  const resendEmail = async ({ email }: ResendValues) => {
    setError(undefined);
    try { const result = await resend.run(() => authGateway.resendVerification(email)); if (result?.status === "accepted") { setAccepted(true); countdown.restart(45); } }
    catch (caught) { if (!isAuthGatewayError(caught)) throw caught; setError(caught.message); if (caught.field === "email") setFieldError("email", { message: caught.message }); }
  };
  return <div className={styles.form}>
    {error && <Alert variant="error" title="Email verification not completed">{error}</Alert>}
    {accepted && <Alert variant="success" title="Request accepted">Check your email for a new single-use verification link.</Alert>}
    {token ? <><Alert variant="info" title="Verification link ready">Continue to verify your email and start the protected identity-verification session.</Alert><Button type="button" icon={<MailCheck size={16} />} isLoading={verification.isSubmitting} loadingText="Verifying email" onClick={() => void verify()} fullWidth>Verify email</Button></> :
      <form onSubmit={handleSubmit(resendEmail)}><Alert variant="info" title="Open your verification email">Use the single-use link sent after registration, or request another link below.</Alert><Input label="Registration email" icon={<Mail size={16} />} type="email" autoComplete="email" placeholder="alice.mukamana@example.rw" error={errors.email?.message} disabled={resend.isSubmitting} {...register("email")} /><Button type="submit" variant="secondary" icon={<RotateCcw size={16} />} isLoading={resend.isSubmitting} loadingText="Requesting link" disabled={!countdown.isComplete} fullWidth>{countdown.isComplete ? "Send another verification link" : `Try again in ${countdown.seconds}s`}</Button></form>}
  </div>;
}
