"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CitizenPreview } from "@/components/auth/CitizenPreview";
import { RegistrationStepper } from "@/components/auth/RegistrationStepper";
import { CitizenLookupForm } from "@/components/forms/CitizenLookupForm";
import { CreateAccountForm } from "@/components/forms/CreateAccountForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusIcon } from "@/components/ui/StatusIcon";
import { useMockSubmission } from "@/hooks/useMockSubmission";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "@/lib/validation/auth.schemas";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import { isAuthGatewayError, type CitizenLookupResult } from "@/services/auth";
import {
  RegistrationFlowProvider,
  useRegistrationFlow,
} from "@/state/RegistrationFlowProvider";
import styles from "./CreateAccountFlow.module.css";

const defaultValues: RegistrationFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
  acceptedPrivacy: false,
  acceptedBiometricProcessing: false,
};

function CreateAccountFlowContent() {
  const { state, dispatch } = useRegistrationFlow();
  const { isSubmitting, run } = useMockSubmission();
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const citizenFound = (result: CitizenLookupResult) => {
    dispatch({
      type: "CITIZEN_FOUND",
      challengeReference: result.challengeReference,
      citizen: result.citizen,
    });
  };

  const credentialsContinue = async () => {
    const valid = await form.trigger(["email", "password", "confirmPassword"], {
      shouldFocus: true,
    });

    if (!valid) {
      toast.error("Check the account fields", {
        description: "Correct the inline errors before continuing.",
      });
      return;
    }

    dispatch({
      type: "CREDENTIALS_COMPLETED",
      email: form.getValues("email"),
    });
  };

  const registerAccount = async (values: RegistrationFormValues) => {
    if (!state.challengeReference) {
      toast.error("The registration challenge is unavailable.");
      dispatch({ type: "RESET" });
      return;
    }

    try {
      const result = await run(() =>
        authGateway.register({
          challengeReference: state.challengeReference as string,
          email: values.email,
          password: values.password,
          acceptedTerms: values.acceptedTerms,
          acceptedPrivacy: values.acceptedPrivacy,
          acceptedBiometricProcessing: values.acceptedBiometricProcessing,
        }),
      );

      if (!result) return;

      dispatch({
        type: "REGISTRATION_COMPLETED",
        maskedEmail: result.maskedEmail,
        userReference: result.userReference,
      });
      form.reset(defaultValues);
      toast.success("Static account created", {
        description: "No backend record, credential, or email was created.",
      });
    } catch (error) {
      if (isAuthGatewayError(error) && error.code === "EMAIL_ALREADY_USED") {
        dispatch({ type: "RETURN_TO_CREDENTIALS" });
        form.setError("email", { message: error.message });
        globalThis.setTimeout(() => form.setFocus("email"), 0);
        toast.error("Email already used", { description: error.message });
        return;
      }

      toast.error("The static account could not be created.");
    }
  };

  return (
    <div className={styles.flow}>
      <RegistrationStepper currentStep={state.step} />

      <div className={styles.stage}>
        {state.step === "CITIZEN_LOOKUP" && (
          <CitizenLookupForm onFound={citizenFound} />
        )}

        {state.step === "CITIZEN_REVIEW" && state.citizen && (
          <div className={styles.review}>
            <CitizenPreview citizen={state.citizen} />
            <div className={styles.actions}>
              <Button
                type="button"
                variant="secondary"
                icon={<ArrowLeft size={16} />}
                onClick={() => dispatch({ type: "GO_BACK" })}
              >
                Use another ID
              </Button>
              <Button
                type="button"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                onClick={() => dispatch({ type: "CITIZEN_CONFIRMED" })}
              >
                This information is correct
              </Button>
            </div>
          </div>
        )}

        {(state.step === "CREDENTIALS" || state.step === "CONSENT") && (
          <CreateAccountForm
            step={state.step}
            form={form}
            isSubmitting={isSubmitting}
            onBack={() => dispatch({ type: "GO_BACK" })}
            onCredentialsContinue={credentialsContinue}
            onRegister={registerAccount}
          />
        )}

        {state.step === "COMPLETE" && (
          <section
            className={styles.complete}
            aria-labelledby="registration-success-title"
          >
            <StatusIcon
              variant="success"
              size="lg"
              label="Static registration completed"
            />
            <div>
              <span className={styles.kicker}>
                Static registration complete
              </span>
              <h2 id="registration-success-title">
                Your demonstration account is ready for email verification
              </h2>
              <p>
                A real implementation would now send a single-use verification
                message to{" "}
                <strong>
                  {state.maskedEmail ?? "your masked email address"}
                </strong>
                .
              </p>
            </div>

            <Alert variant="success" title="No sensitive record was created">
              The password and consent form were cleared. No account, session,
              email, NIDA request, or token was created.
            </Alert>

            <div className={styles.completeActions}>
              <LinkButton
                href="/verify-email"
                icon={<ShieldCheck size={16} />}
                fullWidth
              >
                Continue to email verification
              </LinkButton>
              <Button
                type="button"
                variant="secondary"
                icon={<RotateCcw size={16} />}
                onClick={() => dispatch({ type: "RESET" })}
                fullWidth
              >
                Restart demonstration
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export function CreateAccountFlow() {
  return (
    <RegistrationFlowProvider>
      <CreateAccountFlowContent />
    </RegistrationFlowProvider>
  );
}
