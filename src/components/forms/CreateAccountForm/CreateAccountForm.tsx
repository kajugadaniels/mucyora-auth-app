"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { PasswordRequirements } from "@/components/auth/PasswordRequirements";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import styles from "./CreateAccountForm.module.css";

export interface RegistrationFormValues {
  email: string;
  phoneNumber: string;
  password: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedIdentityDataProcessing: boolean;
  acceptedBiometricProcessing: boolean;
}

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
            Use your private email address, Rwandan phone number, and a strong
            passphrase. The backend validates every submitted value.
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
            disabled={isSubmitting}
            {...register("email")}
          />

          <Input
            label="Rwandan phone number"
            icon={<Phone size={16} />}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+250 788 123 456"
            error={errors.phoneNumber?.message}
            disabled={isSubmitting}
            {...register("phoneNumber")}
          />

          <PasswordInput
            label="Create password"
            autoComplete="new-password"
            placeholder="Use a long private passphrase"
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register("password")}
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
      onSubmit={handleSubmit(onRegister)}
    >
      <div className={styles.intro}>
        <h2>Review required consent</h2>
        <p>
          MUCYORA records each required consent with the active policy version.
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
          label="I consent to identity-data processing"
          description="Required to compare your authoritative identity record with live verification evidence."
          error={errors.acceptedIdentityDataProcessing?.message}
          disabled={isSubmitting}
          {...register("acceptedIdentityDataProcessing")}
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
          Consent is recorded only when the backend successfully creates your
          account, together with the applicable policy versions.
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
          Create account
        </Button>
      </div>
    </form>
  );
}
