"use client";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCountdown } from "@/hooks/useCountdown";
import { useSubmission } from "@/hooks/useSubmission";
import { authGateway, isAuthGatewayError } from "@/services/auth";
import styles from "./ForgotPasswordForm.module.css";
interface Values { email: string; }
export function ForgotPasswordForm() {
  const [accepted, setAccepted] = useState(false); const [error, setError] = useState<string>();
  const submission = useSubmission(); const cooldown = useCountdown(0);
  const { register, handleSubmit, formState: { errors }, setError: setFieldError } = useForm<Values>({ defaultValues: { email: "" } });
  const submit = async ({ email }: Values) => {
    setError(undefined);
    try { const result = await submission.run(() => authGateway.forgotPassword(email)); if (result?.status === "accepted") { setAccepted(true); cooldown.restart(30); } }
    catch (caught) { if (!isAuthGatewayError(caught)) throw caught; setError(caught.message); if (caught.field === "email") setFieldError("email", { message: caught.message }); }
  };
  return <form className={styles.form} onSubmit={handleSubmit(submit)}>
    {accepted && <Alert variant="success" title="Request accepted">Check your email for the next step if the address is eligible.</Alert>}
    {error && <Alert variant="error" title="Recovery request not completed">{error}</Alert>}
    <Input label="Account email address" icon={<Mail size={16} />} type="email" inputMode="email" autoComplete="email" placeholder="alice.mukamana@example.rw" error={errors.email?.message} disabled={submission.isSubmitting} {...register("email")} />
    <Button type="submit" icon={<Send size={16} />} isLoading={submission.isSubmitting} loadingText="Requesting recovery" disabled={!cooldown.isComplete} fullWidth>{cooldown.isComplete ? accepted ? "Send instructions again" : "Send recovery instructions" : `Try again in ${cooldown.seconds}s`}</Button>
    <p className={styles.privacy}>For privacy, the backend returns the same accepted status whether or not an eligible account exists.</p>
  </form>;
}
