"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Search, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useMockSubmission } from "@/hooks/useMockSubmission";
import {
  citizenLookupSchema,
  type CitizenLookupFormValues,
} from "@/lib/validation/auth.schemas";
import { mockCitizenNationalId } from "@/mocks/data/citizens";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import { isAuthGatewayError, type CitizenLookupResult } from "@/services/auth";
import styles from "./CitizenLookupForm.module.css";

export interface CitizenLookupFormProps {
  onFound: (result: CitizenLookupResult) => void;
}

export function CitizenLookupForm({ onFound }: CitizenLookupFormProps) {
  const { isSubmitting, run } = useMockSubmission();
  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<CitizenLookupFormValues>({
    resolver: zodResolver(citizenLookupSchema),
    defaultValues: { nationalId: "" },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: CitizenLookupFormValues) => {
    try {
      const result = await run(() => authGateway.lookupCitizen(values));
      if (!result) return;

      onFound(result);
      toast.success("Demonstration citizen found", {
        description: "Review the fake identity information before continuing.",
      });
    } catch (error) {
      if (isAuthGatewayError(error)) {
        setError("nationalId", { message: error.message });
        setFocus("nationalId");
        toast.error(
          error.code === "CITIZEN_ALREADY_REGISTERED"
            ? "Identity already registered"
            : "Citizen record not found",
          { description: error.message },
        );
        return;
      }

      toast.error("The static citizen lookup could not be completed.");
    }
  };

  const useDemoIdentity = () => {
    setValue("nationalId", mockCitizenNationalId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setFocus("nationalId");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label="Rwanda National ID"
        icon={<BadgeCheck size={16} />}
        inputMode="numeric"
        autoComplete="off"
        placeholder="Enter 16 digits"
        maxLength={16}
        error={errors.nationalId?.message}
        hint="Use the fake demonstration number below. No NIDA request is made."
        required
        disabled={isSubmitting}
        {...register("nationalId")}
      />

      <div className={styles.actions}>
        <Button
          type="submit"
          icon={<Search size={16} />}
          isLoading={isSubmitting}
          loadingText="Checking identity"
          fullWidth
        >
          Find citizen record
        </Button>

        <Button
          type="button"
          variant="secondary"
          icon={<Sparkles size={16} />}
          onClick={useDemoIdentity}
          disabled={isSubmitting}
          fullWidth
        >
          Use demo National ID
        </Button>
      </div>

      <div className={styles.demo} role="note">
        <strong>Successful demonstration ID</strong>
        <code>{mockCitizenNationalId}</code>
        <span>
          Already-registered state:{" "}
          <code>{authMockScenarios.registeredNationalId}</code>
        </span>
      </div>
    </form>
  );
}
