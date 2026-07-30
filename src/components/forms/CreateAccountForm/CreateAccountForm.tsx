"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import type { RegistrationFormValues } from "@/lib/validation/auth.schemas";
import styles from "./CreateAccountForm.module.css";

export interface CreateAccountFormProps {
  step: "CREDENTIALS" | "CONSENT";
  form: UseFormReturn<RegistrationFormValues>;
  isSubmitting: boolean;
  onBack: () => void;
  onCredentialsContinue: () => Promise<void>;
  onRegister: (values: RegistrationFormValues) => Promise<void>;
}

export function CreateAccountForm({
  step,
  form,
  isSubmitting,
  onBack,
  onCredentialsContinue,
  onRegister,
}: CreateAccountFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const password = watch("password");
  const email = watch("email");

  const onInvalid = () => {
    toast.error("Check the highlighted fields", {
      description: "Correct the inline validation errors before continuing.",
    });
  };

  if (step === "CREDENTIALS") {
    return (
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void onCredentialsContinue();
        }}
        noValidate
      >
        <div className={styles.intro}>
          <h2>Create your account credentials</h2>
          <p>
            Use a private email address and a long passphrase. These static
            values remain only in this browser memory and are cleared after the
            mock submission.
          </p>
        </div>

        <div className={styles.fields}>
          <Input
            label="Email address"
            icon={<Mail size={16} />}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            required
            disabled={isSubmitting}
            {...register("email")}
          />

          <PasswordInput
            label="Create password"
            autoComplete="new-password"
            placeholder="Use a long private passphrase"
            error={errors.password?.message}
            required
            disabled={isSubmitting}
            {...register("password")}
          />

          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            required
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
        </div>

        <PasswordRequirements password={password ?? ""} email={email ?? ""} />

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>

          <Button
            type="submit"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            disabled={isSubmitting}
          >
            Continue
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onRegister, onInvalid)}
      noValidate
    >
      <div className={styles.intro}>
        <h2>Review required consent</h2>
        <p>
          These checkboxes demonstrate the policy records that the backend will
          store with explicit versions. No real consent record is created in
          this static build.
        </p>
      </div>

      <div className={styles.consents}>
        <Checkbox
          label="I agree to the MUCYORA Terms of Use"
          description="Required to create and use a MUCYORA account."
          error={errors.acceptedTerms?.message}
          disabled={isSubmitting}
          {...register("acceptedTerms")}
        />

        <Checkbox
          label="I acknowledge the MUCYORA Privacy Notice"
          description="Explains how identity and authentication information is handled."
          error={errors.acceptedPrivacy?.message}
          disabled={isSubmitting}
          {...register("acceptedPrivacy")}
        />

        <Checkbox
          label="I consent to biometric processing for identity verification"
          description="Required later for the protected account-verification flow."
          error={errors.acceptedBiometricProcessing?.message}
          disabled={isSubmitting}
          {...register("acceptedBiometricProcessing")}
        />
      </div>

      <div className={styles.assurance} role="note">
        <ShieldCheck size={17} aria-hidden="true" />
        <p>
          Creating this static account does not contact NIDA, send email, create
          credentials, or store biometric consent.
        </p>
      </div>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          icon={<ArrowLeft size={16} />}
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          type="submit"
          icon={<CheckCircle2 size={16} />}
          isLoading={isSubmitting}
          loadingText="Creating account"
        >
          Create static account
        </Button>
      </div>
    </form>
  );
}
