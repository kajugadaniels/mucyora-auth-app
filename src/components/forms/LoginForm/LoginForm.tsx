"use client";

import {
  Alert02Icon,
  CheckmarkCircle01Icon,
  Key01Icon,
  Login01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useMockSubmission } from "@/hooks/useMockSubmission";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validation/auth.schemas";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import { isAuthGatewayError, type LoginResult } from "@/services/auth";
import styles from "./LoginForm.module.css";

type LoginNotice = {
  variant: "success" | "warning" | "error";
  title: string;
  message: string;
};

function resultToNotice(result: LoginResult): LoginNotice {
  if (result.status === "IDENTITY_VERIFICATION_REQUIRED") {
    return {
      variant: "warning",
      title: "Identity verification is required",
      message:
        "The demonstration credentials were accepted. The next step would continue to identity verification after that static phase is implemented.",
    };
  }

  return {
    variant: "success",
    title: "Static sign-in completed",
    message:
      "The mock gateway accepted the demonstration account. No session or authentication token was created.",
  };
}

export function LoginForm() {
  const [notice, setNotice] = useState<LoginNotice | null>(null);

  const { isSubmitting, run } = useMockSubmission();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberDevice: false,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: LoginFormValues) => {
    setNotice(null);

    try {
      const result = await run(() => authGateway.login(values));

      if (!result) {
        return;
      }

      const nextNotice = resultToNotice(result);

      setNotice(nextNotice);
      resetField("password");

      if (nextNotice.variant === "success") {
        toast.success("Sign-in demonstration completed", {
          description: "No real session or token was created.",
        });

        return;
      }

      toast.warning(nextNotice.title, {
        description: nextNotice.message,
      });
    } catch (error) {
      if (!isAuthGatewayError(error)) {
        toast.error("The static sign-in could not be completed.");

        return;
      }

      if (error.code === "ACCOUNT_LOCKED") {
        const accountLockedNotice: LoginNotice = {
          variant: "error",
          title: "Demonstration account locked",
          message:
            "This mock state shows how a temporary account restriction will be explained without exposing security controls.",
        };

        setNotice(accountLockedNotice);
        toast.error(accountLockedNotice.title);

        return;
      }

      if (error.code === "EMAIL_NOT_VERIFIED") {
        const verificationNotice: LoginNotice = {
          variant: "warning",
          title: "Email verification required",
          message:
            "This mock state shows the next action for an account that has not verified its email address.",
        };

        setNotice(verificationNotice);
        toast.warning(verificationNotice.title);

        return;
      }

      toast.error("The email or password is not correct.", {
        description: "Use the documented static demonstration credentials.",
      });
    }
  };

  const onInvalid = () => {
    toast.error("Check the highlighted fields", {
      description: "Correct the inline validation errors and try again.",
    });
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
    >
      {notice && (
        <Alert variant={notice.variant} title={notice.title}>
          {notice.message}
        </Alert>
      )}

      <div className={styles.fields}>
        <Input
          label="Email address"
          icon={
            <HugeiconsIcon
              icon={Mail01Icon}
              size={16}
              color="currentColor"
              strokeWidth={1.8}
            />
          }
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
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          required
          disabled={isSubmitting}
          {...register("password")}
        />
      </div>

      <div className={styles.options}>
        <Checkbox
          label="Remember this device"
          description="Static only. No device or session is saved."
          disabled={isSubmitting}
          {...register("rememberDevice")}
        />

        <Link className={styles.recoveryButton} href="/forgot-password">
          <HugeiconsIcon
            icon={Key01Icon}
            size={15}
            color="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        icon={
          <HugeiconsIcon
            icon={Login01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.8}
          />
        }
        isLoading={isSubmitting}
        loadingText="Signing in"
        fullWidth
      >
        Sign in
      </Button>

      <div className={styles.demo} role="note">
        <span className={styles.demoIcon} aria-hidden="true">
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            size={16}
            color="currentColor"
            strokeWidth={1.8}
          />
        </span>

        <div>
          <strong>Demonstration credentials</strong>

          <p>
            Email: <code>{authMockScenarios.demoCredentials.email}</code>
          </p>

          <p>
            Password: <code>{authMockScenarios.demoCredentials.password}</code>
          </p>

          <p className={styles.alternate}>
            Try <code>{authMockScenarios.emailNotVerified}</code> or{" "}
            <code>{authMockScenarios.accountLocked}</code> to preview other
            states.
          </p>
        </div>
      </div>

      <p className={styles.securityLine}>
        <HugeiconsIcon
          icon={Alert02Icon}
          size={15}
          color="currentColor"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Never use real credentials in this static demonstration.
      </p>
    </form>
  );
}
