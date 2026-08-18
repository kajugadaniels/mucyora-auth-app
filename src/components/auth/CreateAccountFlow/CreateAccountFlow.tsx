"use client";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegistrationStepper } from "@/components/auth/RegistrationStepper";
import { CitizenLookupForm } from "@/components/forms/CitizenLookupForm";
import { CreateAccountForm, type RegistrationFormValues } from "@/components/forms/CreateAccountForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusIcon } from "@/components/ui/StatusIcon";
import { useSubmission } from "@/hooks/useSubmission";
import { authFlowState, authGateway, isAuthGatewayError, type CitizenLookupResult, type RegistrationConsent } from "@/services/auth";
import { RegistrationFlowProvider, useRegistrationFlow } from "@/state/RegistrationFlowProvider";
import styles from "./CreateAccountFlow.module.css";

const policyVersion = process.env.NEXT_PUBLIC_MUCYORA_IDENTITY_POLICY_VERSION || "2026-07-01";
const defaultValues: RegistrationFormValues = { email: "", phoneNumber: "", password: "", confirmPassword: "", acceptedTerms: false, acceptedPrivacy: false, acceptedIdentityDataProcessing: false, acceptedBiometricProcessing: false };

function Content() {
  const { state, dispatch } = useRegistrationFlow();
  const submission = useSubmission();
  const [error, setError] = useState<string>();
  const form = useForm<RegistrationFormValues>({ defaultValues });
  const citizenFound = (result: CitizenLookupResult) => dispatch({ type: "CITIZEN_FOUND", registrationChallengeToken: result.registrationChallengeToken });
  const credentialsContinue = async () => {
    const valid = await form.trigger(["email", "phoneNumber", "password", "confirmPassword"]);
    if (valid) dispatch({ type: "CREDENTIALS_COMPLETED", email: form.getValues("email") });
  };
  const registerAccount = async (values: RegistrationFormValues) => {
    setError(undefined);
    if (!state.registrationChallengeToken) return dispatch({ type: "RESET" });
    try {
      const consents: RegistrationConsent[] = [];
      if (values.acceptedTerms) consents.push({ type: "TERMS_OF_SERVICE", policyVersion });
      if (values.acceptedPrivacy) consents.push({ type: "PRIVACY_POLICY", policyVersion });
      if (values.acceptedIdentityDataProcessing) consents.push({ type: "IDENTITY_DATA_PROCESSING", policyVersion });
      if (values.acceptedBiometricProcessing) consents.push({ type: "BIOMETRIC_PROCESSING", policyVersion });
      const result = await submission.run(() => authGateway.register({
        registrationChallengeToken: state.registrationChallengeToken!, email: values.email, phoneNumber: values.phoneNumber, password: values.password, confirmPassword: values.confirmPassword,
        consents,
      }));
      if (!result) return;
      authFlowState().registrationEmail = values.email;
      dispatch({ type: "REGISTRATION_COMPLETED", maskedEmail: result.maskedEmail, userReference: result.userReference });
      form.reset(defaultValues);
    } catch (caught) {
      if (!isAuthGatewayError(caught)) throw caught;
      setError(caught.message);
      if (caught.field === "email" || caught.field === "phoneNumber" || caught.field === "password" || caught.field === "confirmPassword") {
        dispatch({ type: "RETURN_TO_CREDENTIALS" });
        form.setError(caught.field, { message: caught.message });
      }
    }
  };
  return <div className={styles.flow}>
    <RegistrationStepper currentStep={state.step} />
    <div className={styles.stage}>
      {error && <Alert variant="error" title="Registration not completed">{error}</Alert>}
      {state.step === "CITIZEN_LOOKUP" && <CitizenLookupForm onFound={citizenFound} />}
      {(state.step === "CREDENTIALS" || state.step === "CONSENT") && <CreateAccountForm step={state.step} form={form} isSubmitting={submission.isSubmitting} onBack={() => dispatch({ type: "GO_BACK" })} onCredentialsContinue={credentialsContinue} onRegister={registerAccount} />}
      {state.step === "COMPLETE" && <section className={styles.complete} aria-labelledby="registration-success-title">
        <StatusIcon variant="success" size="lg" label="Registration completed" />
        <div><span className={styles.kicker}>Registration accepted</span><h2 id="registration-success-title">Verify your email to continue</h2><p>A single-use verification link was sent to <strong>{state.maskedEmail}</strong>.</p></div>
        <Alert variant="success" title="Email verification required">Open the link in your email. It will return you here and start the protected identity-enrolment session.</Alert>
        <div className={styles.completeActions}><LinkButton href="/verify-email" icon={<ShieldCheck size={16} />} fullWidth>Open email verification</LinkButton><Button type="button" variant="secondary" icon={<RotateCcw size={16} />} onClick={() => dispatch({ type: "RESET" })} fullWidth>Start again</Button></div>
      </section>}
    </div>
  </div>;
}
export function CreateAccountFlow() { return <RegistrationFlowProvider><Content /></RegistrationFlowProvider>; }
