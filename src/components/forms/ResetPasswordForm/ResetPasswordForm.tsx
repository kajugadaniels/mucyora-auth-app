"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, KeyRound, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useMockSubmission } from "@/hooks/useMockSubmission";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validation/auth.schemas";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import { isAuthGatewayError } from "@/services/auth";
import styles from "./ResetPasswordForm.module.css";

export interface ResetPasswordFormProps {
  resetReference: string;
}

export function ResetPasswordForm({ resetReference }: ResetPasswordFormProps) {
  const [completed, setCompleted] = useState(false);
  const [expired, setExpired] = useState(false);
  const submission = useMockSubmission();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const password = watch("password");

  const submit = async (values: ResetPasswordFormValues) => {
    try {
      await submission.run(() =>
        authGateway.resetPassword({
          resetReference,
          password: values.password,
        }),
      );
      reset();
      setCompleted(true);
      toast.success("Password reset demonstration completed", {
        description: "No credential, session, or token was changed.",
      });
    } catch (error) {
      if (
        isAuthGatewayError(error) &&
        error.code === "RESET_REFERENCE_EXPIRED"
      ) {
        setExpired(true);
        toast.error("Recovery link expired", { description: error.message });
        return;
      }
      toast.error("The static password reset could not be completed.");
    }
  };

  if (expired) {
    return (
      <div className={styles.result}>
        <Alert
          variant="error"
          title="This demonstration recovery link has expired"
        >
          Return to password recovery to request a new link. No account
          information was changed.
        </Alert>
        <LinkButton
          href="/forgot-password"
          icon={<KeyRound size={16} />}
          fullWidth
        >
          Request another recovery link
        </LinkButton>
      </div>
    );
  }

  if (completed) {
    return (
      <div className={styles.result}>
        <Alert variant="success" title="Static password reset completed">
          A real implementation would revoke or review existing sessions and
          notify the account owner. This demonstration changed nothing.
        </Alert>
        <LinkButton href="/login" icon={<LogIn size={16} />} fullWidth>
          Return to sign in
        </LinkButton>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submit)} noValidate>
      <div className={styles.fields}>
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          placeholder="Use a long private passphrase"
          error={errors.password?.message}
          required
          disabled={submission.isSubmitting}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          error={errors.confirmPassword?.message}
          required
          disabled={submission.isSubmitting}
          {...register("confirmPassword")}
        />
      </div>

      <PasswordRequirements password={password ?? ""} />

      <Button
        type="submit"
        icon={<CheckCircle2 size={16} />}
        isLoading={submission.isSubmitting}
        loadingText="Updating password"
        fullWidth
      >
        Set new password
      </Button>
    </form>
  );
}
