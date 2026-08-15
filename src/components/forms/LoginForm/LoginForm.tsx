"use client";
import { Alert02Icon, Key01Icon, Login01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useSubmission } from "@/hooks/useSubmission";
import { authGateway, isAuthGatewayError } from "@/services/auth";
import styles from "./LoginForm.module.css";
interface LoginValues { email: string; password: string; }
export function LoginForm() {
  const router = useRouter();
  const submission = useSubmission();
  const [error, setError] = useState<string>();
  const { register, handleSubmit, resetField, formState: { errors }, setError: setFieldError } = useForm<LoginValues>({ defaultValues: { email: "", password: "" } });
  useEffect(() => {
    const completionReference = new URLSearchParams(window.location.hash.slice(1)).get("identity-completion");
    if (!completionReference) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    void authGateway.consumeIdentityCompletion(completionReference).catch((caught) => { if (isAuthGatewayError(caught)) setError(caught.message); });
  }, []);
  const submit = async (values: LoginValues) => {
    setError(undefined);
    try {
      const result = await submission.run(() => authGateway.login(values));
      if (!result) return;
      resetField("password");
      if (result.sessionLevel === "LIMITED" || !result.identityVerified) return router.replace("/verification-required");
      window.location.assign(process.env.NEXT_PUBLIC_MUCYORA_APP_ORIGIN || "http://localhost:4001");
    } catch (caught) {
      if (!isAuthGatewayError(caught)) throw caught;
      setError(caught.message);
      if (caught.field === "email" || caught.field === "password") setFieldError(caught.field, { message: caught.message });
    }
  };
  return <form className={styles.form} onSubmit={handleSubmit(submit)}>
    {error && <Alert variant="error" title="Sign-in request not completed">{error}</Alert>}
    <div className={styles.fields}>
      <Input label="Email address" icon={<HugeiconsIcon icon={Mail01Icon} size={16} color="currentColor" strokeWidth={1.8} />} type="email" inputMode="email" autoComplete="email" placeholder="alice.mukamana@example.rw" error={errors.email?.message} disabled={submission.isSubmitting} {...register("email")} />
      <PasswordInput label="Password" autoComplete="current-password" placeholder="Enter your password" error={errors.password?.message} disabled={submission.isSubmitting} {...register("password")} />
    </div>
    <div className={styles.options}><Link className={styles.recoveryButton} href="/forgot-password"><HugeiconsIcon icon={Key01Icon} size={15} color="currentColor" strokeWidth={1.8} aria-hidden="true" />Forgot password?</Link></div>
    <Button type="submit" icon={<HugeiconsIcon icon={Login01Icon} size={16} color="currentColor" strokeWidth={1.8} />} isLoading={submission.isSubmitting} loadingText="Signing in" fullWidth>Sign in</Button>
    <p className={styles.securityLine}><HugeiconsIcon icon={Alert02Icon} size={15} color="currentColor" strokeWidth={1.8} aria-hidden="true" />MUCYORA sends credentials only through the same-origin security gateway.</p>
  </form>;
}
