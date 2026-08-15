"use client";
import { CheckCircle2, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useSubmission } from "@/hooks/useSubmission";
import { authGateway, isAuthGatewayError } from "@/services/auth";
import styles from "./ResetPasswordForm.module.css";
interface Values { password: string; }
export function ResetPasswordForm({ token }: { token: string }) {
  const [completed, setCompleted] = useState(false); const [error, setError] = useState<string>(); const submission = useSubmission();
  const { register, handleSubmit, control, reset, formState: { errors }, setError: setFieldError } = useForm<Values>({ defaultValues: { password: "" } });
  const password = useWatch({ control, name: "password" });
  const submit = async ({ password }: Values) => {
    setError(undefined);
    try { const result = await submission.run(() => authGateway.resetPassword(token, password)); if (result?.status === "changed") { reset(); setCompleted(true); } }
    catch (caught) { if (!isAuthGatewayError(caught)) throw caught; setError(caught.message); if (caught.field === "password") setFieldError("password", { message: caught.message }); }
  };
  if (completed) return <div className={styles.result}><Alert variant="success" title="Password changed">Your password was changed. Sign in again with the new password.</Alert><LinkButton href="/login" icon={<LogIn size={16} />} fullWidth>Return to sign in</LinkButton></div>;
  return <form className={styles.form} onSubmit={handleSubmit(submit)}>
    {error && <Alert variant="error" title="Password reset not completed">{error}</Alert>}
    <div className={styles.fields}><PasswordInput label="New password" autoComplete="new-password" placeholder="Use a long private passphrase" error={errors.password?.message} disabled={submission.isSubmitting} {...register("password")} /></div>
    <PasswordRequirements password={password || ""} />
    <Button type="submit" icon={<CheckCircle2 size={16} />} isLoading={submission.isSubmitting} loadingText="Updating password" fullWidth>Set new password</Button>
  </form>;
}
