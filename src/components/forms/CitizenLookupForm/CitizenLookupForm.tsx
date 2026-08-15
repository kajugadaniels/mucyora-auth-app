"use client";
import { BadgeCheck, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSubmission } from "@/hooks/useSubmission";
import { authGateway, isAuthGatewayError, type CitizenLookupResult } from "@/services/auth";
import styles from "./CitizenLookupForm.module.css";
interface Values { nationalId: string; }
export interface CitizenLookupFormProps { onFound: (result: CitizenLookupResult) => void; }
export function CitizenLookupForm({ onFound }: CitizenLookupFormProps) {
  const submission = useSubmission();
  const [error, setError] = useState<string>();
  const { register, handleSubmit, setError: setFieldError, formState: { errors } } = useForm<Values>({ defaultValues: { nationalId: "" } });
  const submit = async (values: Values) => {
    setError(undefined);
    try { const result = await submission.run(() => authGateway.lookupCitizen(values)); if (result) onFound(result); }
    catch (caught) { if (!isAuthGatewayError(caught)) throw caught; setError(caught.message); setFieldError("nationalId", { message: caught.message }); }
  };
  return <form className={styles.form} onSubmit={handleSubmit(submit)}>
    {error && <Alert variant="error" title="Identity lookup not completed">{error}</Alert>}
    <Input label="Rwanda National ID" icon={<BadgeCheck size={16} />} inputMode="numeric" autoComplete="off" placeholder="1199080012345678" maxLength={16} error={errors.nationalId?.message} hint="Your ID is checked by the protected citizen lookup service and is not retained by this page." disabled={submission.isSubmitting} {...register("nationalId")} />
    <div className={styles.actions}><Button type="submit" icon={<Search size={16} />} isLoading={submission.isSubmitting} loadingText="Checking identity" fullWidth>Continue securely</Button></div>
  </form>;
}
