"use client";

import { Camera, CameraOff, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { SelectField } from "@/components/ui/SelectField";
import {
  SelfieFrame,
  type SelfieFrameState,
} from "@/components/auth/SelfieFrame";
import { liveCheckFormSchema } from "@/lib/validation/identity.schemas";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import type { VerificationResultScenario } from "@/services/auth";
import styles from "./LiveCheckForm.module.css";

const scenarioOptions = [
  { value: "success", label: "Successful verification" },
  { value: "retry", label: "Capture retry required" },
  { value: "pending", label: "Review pending" },
  { value: "failed", label: "Verification failed" },
  { value: "unavailable", label: "Provider unavailable" },
];

export function LiveCheckForm() {
  const router = useRouter();
  const [frameState, setFrameState] = useState<SelfieFrameState>("idle");
  const [scenario, setScenario] =
    useState<VerificationResultScenario>("success");
  const [acceptedGuidance, setAcceptedGuidance] = useState(false);
  const [guidanceError, setGuidanceError] = useState<string>();
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearCaptureTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function requestPermission() {
    setFrameState("requesting");
    globalThis.setTimeout(() => {
      setFrameState("ready");
      toast.success("Static camera permission granted", {
        description:
          "No browser permission was requested and no camera was opened.",
      });
    }, 650);
  }

  function previewDeniedPermission() {
    setFrameState("denied");
    toast.warning("Static camera permission declined", {
      description: "Use the retry action to return to the permission step.",
    });
  }

  function resetPermission() {
    clearCaptureTimer();
    setProgress(0);
    setFrameState("idle");
  }

  async function startCheck() {
    const parsed = liveCheckFormSchema.safeParse({
      scenario,
      acceptedGuidance,
    });

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ??
        "Review the guidance before continuing.";
      setGuidanceError(message);
      toast.error("Review the capture guidance", { description: message });
      return;
    }

    setGuidanceError(undefined);
    setFrameState("capturing");
    setProgress(6);

    intervalRef.current = setInterval(() => {
      setProgress((current) =>
        current >= 90 ? current : Math.min(90, current + 9),
      );
    }, 150);

    try {
      const result = await authGateway.startLiveCheck({
        verificationAttemptReference:
          authMockScenarios.verificationAttemptReference,
        scenario: parsed.data.scenario,
      });

      clearCaptureTimer();
      setProgress(100);
      setFrameState("complete");

      const state =
        result.status === "PASS"
          ? "success"
          : result.status === "RETRY"
            ? "retry"
            : result.status === "PENDING"
              ? "pending"
              : result.status === "UNAVAILABLE"
                ? "unavailable"
                : "failed";

      globalThis.setTimeout(() => {
        router.push(`/identity-verification/result?state=${state}`);
      }, 450);
    } catch {
      clearCaptureTimer();
      setFrameState("complete");
      globalThis.setTimeout(() => {
        router.push("/identity-verification/result?state=unavailable");
      }, 350);
    }
  }

  return (
    <div className={styles.form}>
      <Alert variant="info" title="Static live-check simulation">
        This screen never opens the camera, records a face, evaluates liveness,
        or calls the MUCYORA Engine.
      </Alert>

      <SelfieFrame state={frameState} progress={progress} />

      {frameState === "idle" && (
        <div className={styles.permissionActions}>
          <Button
            icon={<Camera size={16} />}
            onClick={requestPermission}
            fullWidth
          >
            Simulate camera permission
          </Button>
          <Button
            variant="secondary"
            icon={<CameraOff size={16} />}
            onClick={previewDeniedPermission}
            fullWidth
          >
            Preview permission denied
          </Button>
        </div>
      )}

      {frameState === "requesting" && (
        <Button
          icon={<Camera size={16} />}
          isLoading
          loadingText="Requesting permission"
          fullWidth
        >
          Requesting permission
        </Button>
      )}

      {frameState === "denied" && (
        <div className={styles.denied}>
          <Alert variant="warning" title="Camera access is needed">
            A real browser flow would explain how to enable permission without
            exposing or changing other device settings.
          </Alert>
          <Button
            icon={<RotateCcw size={16} />}
            onClick={resetPermission}
            fullWidth
          >
            Try permission step again
          </Button>
        </div>
      )}

      {(frameState === "ready" ||
        frameState === "capturing" ||
        frameState === "complete") && (
        <>
          <div className={styles.scenario}>
            <SelectField
              label="Static verification result"
              icon={<ShieldCheck size={16} />}
              value={scenario}
              options={scenarioOptions}
              disabled={frameState === "capturing" || frameState === "complete"}
              onChange={(event) =>
                setScenario(event.target.value as VerificationResultScenario)
              }
              hint="This development control selects the local result page to demonstrate."
            />
          </div>

          <Checkbox
            label="I reviewed the capture guidance"
            description="This confirmation is local and is not stored."
            checked={acceptedGuidance}
            disabled={frameState === "capturing" || frameState === "complete"}
            error={guidanceError}
            onChange={(event) => {
              setAcceptedGuidance(event.target.checked);
              if (event.target.checked) setGuidanceError(undefined);
            }}
          />

          <Button
            icon={<Play size={16} />}
            isLoading={frameState === "capturing" || frameState === "complete"}
            loadingText={
              frameState === "complete"
                ? "Opening result"
                : "Simulating live check"
            }
            disabled={frameState !== "ready"}
            onClick={startCheck}
            fullWidth
          >
            Start static live check
          </Button>
        </>
      )}
    </div>
  );
}
