"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MailCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { OtpInput } from "@/components/ui/OtpInput";
import { useCountdown } from "@/hooks/useCountdown";
import { useMockSubmission } from "@/hooks/useMockSubmission";
import {
  emailVerificationSchema,
  type EmailVerificationFormValues,
} from "@/lib/validation/auth.schemas";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import { isAuthGatewayError } from "@/services/auth";
import styles from "./EmailVerificationForm.module.css";

export interface EmailVerificationFormProps {
  maskedEmail?: string;
}

export function EmailVerificationForm({
  maskedEmail = "a••••@example.com",
}: EmailVerificationFormProps) {
  const [verified, setVerified] = useState(false);
  const verifySubmission = useMockSubmission();
  const resendSubmission = useMockSubmission();
  const resendCountdown = useCountdown(0);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const verify = async (values: EmailVerificationFormValues) => {
    try {
      const result = await verifySubmission.run(() =>
        authGateway.verifyEmail(values),
      );
      if (!result?.verified) return;

      setVerified(true);
      reset();
      toast.success("Email verification demonstration completed", {
        description: "No email token or account state was changed.",
      });
    } catch (error) {
      if (isAuthGatewayError(error)) {
        setError("code", { message: error.message });
        toast.error(
          error.code === "VERIFICATION_CODE_EXPIRED"
            ? "Verification code expired"
            : "Verification code not accepted",
          { description: error.message },
        );
        return;
      }

      toast.error("The verification demonstration could not be completed.");
    }
  };

  const resend = async () => {
    await resendSubmission.run(() =>
      authGateway.resendVerification({ email: "static@example.com" }),
    );

    resendCountdown.restart(45);
    toast.success("A static resend was simulated", {
      description: "No email was sent and no account existence was disclosed.",
    });
  };

  if (verified) {
    return (
      <div className={styles.success}>
        <Alert
          variant="success"
          title="Email verified in the static demonstration"
        >
          The next real onboarding action would be identity verification. This
          build created no account state or session.
        </Alert>
        <LinkButton
          href="/registration-complete"
          icon={<CheckCircle2 size={16} />}
          fullWidth
        >
          Review registration completion
        </LinkButton>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(verify)} noValidate>
      <Alert variant="info" title="Check your verification message">
        Enter the six-digit demonstration code sent to{" "}
        <strong>{maskedEmail}</strong>. No real message was sent.
      </Alert>

      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <OtpInput
            label="Email verification code"
            value={field.value}
            onChange={field.onChange}
            error={errors.code?.message}
            hint={`Use ${authMockScenarios.verificationCode}. Use ${authMockScenarios.expiredVerificationCode} to preview an expired code.`}
            disabled={verifySubmission.isSubmitting}
            autoFocus
          />
        )}
      />

      <Button
        type="submit"
        icon={<MailCheck size={16} />}
        isLoading={verifySubmission.isSubmitting}
        loadingText="Verifying email"
        fullWidth
      >
        Verify email
      </Button>

      <div className={styles.resend}>
        <p>Did not receive the message?</p>
        <Button
          type="button"
          variant="secondary"
          icon={<RotateCcw size={16} />}
          isLoading={resendSubmission.isSubmitting}
          loadingText="Resending"
          disabled={!resendCountdown.isComplete}
          onClick={() => void resend()}
        >
          {resendCountdown.isComplete
            ? "Resend demonstration code"
            : `Resend in ${resendCountdown.seconds}s`}
        </Button>
      </div>
    </form>
  );
}
