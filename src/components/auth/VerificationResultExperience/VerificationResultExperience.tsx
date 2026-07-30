"use client";

import {
  ArrowLeft,
  Headphones,
  LogIn,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VerificationResult } from "@/components/auth/VerificationResult";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { SelectField } from "@/components/ui/SelectField";
import { useCountdown } from "@/hooks/useCountdown";
import {
  getMockVerificationResult,
  type VerificationResultContent,
} from "@/mocks/data/verification-results";
import type { VerificationResultScenario } from "@/services/auth/auth.types";
import styles from "./VerificationResultExperience.module.css";

const scenarioOptions = [
  { value: "success", label: "Successful verification" },
  { value: "retry", label: "Capture retry required" },
  { value: "pending", label: "Review pending" },
  { value: "failed", label: "Verification failed" },
  { value: "unavailable", label: "Provider unavailable" },
];

function isScenario(value: string): value is VerificationResultScenario {
  return ["success", "retry", "pending", "failed", "unavailable"].includes(
    value,
  );
}

export function VerificationResultExperience() {
  const [scenario, setScenario] =
    useState<VerificationResultScenario>("success");

  useEffect(() => {
    const search = new URLSearchParams(globalThis.location?.search ?? "");
    const requested = search.get("state");
    if (requested && isScenario(requested)) setScenario(requested);
  }, []);

  const result: VerificationResultContent = getMockVerificationResult(scenario);

  const { seconds, isComplete, restart } = useCountdown(
    result.retryAfterSeconds ?? 0,
  );

  useEffect(() => {
    restart(result.retryAfterSeconds ?? 0);
  }, [result.retryAfterSeconds, restart]);

  const retryLabel =
    result.retryAfterSeconds && !isComplete
      ? `Retry available in ${seconds} second${seconds === 1 ? "" : "s"}.`
      : undefined;

  function previewSupport() {
    toast.info("Support integration is not active yet", {
      description:
        "A production build would open the approved MUCYORA support channel with a safe result reference.",
    });
  }

  function changeScenario(nextScenario: string) {
    if (!isScenario(nextScenario)) return;
    setScenario(nextScenario);
    const url = new URL(globalThis.location.href);
    url.searchParams.set("state", nextScenario);
    globalThis.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }

  const actions = (() => {
    if (result.status === "PASS") {
      return (
        <>
          <LinkButton href="/login" icon={<LogIn size={16} />}>
            Continue to sign in
          </LinkButton>
          <LinkButton
            href="/identity-verification"
            variant="secondary"
            icon={<ShieldCheck size={16} />}
          >
            Review verification steps
          </LinkButton>
        </>
      );
    }

    if (result.status === "RETRY" || result.status === "UNAVAILABLE") {
      return (
        <>
          <LinkButton
            href="/identity-verification/live-check"
            icon={<RefreshCw size={16} />}
            aria-disabled={!isComplete}
            tabIndex={!isComplete ? -1 : undefined}
            className={!isComplete ? styles.disabledLink : undefined}
          >
            Try live check again
          </LinkButton>
          <Button
            variant="secondary"
            icon={<Headphones size={16} />}
            onClick={previewSupport}
          >
            View support option
          </Button>
        </>
      );
    }

    if (result.status === "PENDING") {
      return (
        <>
          <LinkButton href="/login" icon={<LogIn size={16} />}>
            Return to sign in
          </LinkButton>
          <Button
            variant="secondary"
            icon={<Headphones size={16} />}
            onClick={previewSupport}
          >
            View support option
          </Button>
        </>
      );
    }

    return (
      <>
        <LinkButton
          href="/identity-verification"
          icon={<ArrowLeft size={16} />}
        >
          Review verification guidance
        </LinkButton>
        <Button
          variant="secondary"
          icon={<Headphones size={16} />}
          onClick={previewSupport}
        >
          View support option
        </Button>
      </>
    );
  })();

  return (
    <div className={styles.experience}>
      <div className={styles.previewControl}>
        <SelectField
          label="Static result to preview"
          icon={<ShieldCheck size={16} />}
          value={scenario}
          options={scenarioOptions}
          onChange={(event) => changeScenario(event.target.value)}
          hint="This control changes local demonstration content only."
        />
      </div>
      <VerificationResult
        result={result}
        retryLabel={retryLabel}
        actions={actions}
      />
    </div>
  );
}
