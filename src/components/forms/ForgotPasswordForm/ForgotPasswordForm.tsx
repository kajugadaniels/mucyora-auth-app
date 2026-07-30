"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCountdown } from "@/hooks/useCountdown";
import { useMockSubmission } from "@/hooks/useMockSubmission";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation/auth.schemas";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import styles from "./ForgotPasswordForm.module.css";

export function ForgotPasswordForm() {
  const [requestAcknowledged, setRequestAcknowledged] = useState(false);
  const submission = useMockSubmission();
  const cooldown = useCountdown(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const submit = async (values: ForgotPasswordFormValues) => {
    try {
      await submission.run(() => authGateway.forgotPassword(values));
      setRequestAcknowledged(true);
      cooldown.restart(30);
      toast.success("Recovery request demonstration completed", {
        description:
          "No email was sent and no account existence was disclosed.",
      });
    } catch {
      toast.error("The static recovery request could not be completed.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
      {requestAcknowledged && (
        <Alert variant="success" title="Check your email if an account exists">
          A real service would send recovery instructions only when the address
          belongs to an eligible account. This same message protects account
          privacy.
        </Alert>
      )}

      <Input
        label="Account email address"
        icon={<Mail size={16} />}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        hint="Use any fake email. This static form never submits it."
        required
        disabled={submission.isSubmitting}
        {...register("email")}
      />

      <Button
        type="submit"
        icon={<Send size={16} />}
        isLoading={submission.isSubmitting}
        loadingText="Preparing recovery"
        disabled={!cooldown.isComplete}
        fullWidth
      >
        {cooldown.isComplete
          ? requestAcknowledged
            ? "Send recovery instructions again"
            : "Send recovery instructions"
          : `Try again in ${cooldown.seconds}s`}
      </Button>

      <p className={styles.privacy}>
        For privacy, MUCYORA will always show the same confirmation whether or
        not an account exists.
      </p>
    </form>
  );
}
