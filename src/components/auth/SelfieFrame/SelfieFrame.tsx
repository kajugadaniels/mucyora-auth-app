import { Camera, CameraOff, Check, LoaderCircle, ScanFace } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";
import styles from "./SelfieFrame.module.css";

export type SelfieFrameState =
  | "idle"
  | "requesting"
  | "ready"
  | "capturing"
  | "complete"
  | "denied";

export interface SelfieFrameProps {
  state: SelfieFrameState;
  progress?: number;
}

const stateCopy: Record<
  SelfieFrameState,
  {
    title: string;
    description: string;
  }
> = {
  idle: {
    title: "Camera access has not been requested",
    description:
      "The static demonstration will simulate permission without opening your camera.",
  },
  requesting: {
    title: "Requesting demonstration permission",
    description:
      "No browser permission prompt or device camera is being opened.",
  },
  ready: {
    title: "Ready for the guided live check",
    description: "Keep your face centered and remain still when you start.",
  },
  capturing: {
    title: "Simulating live capture",
    description:
      "This animation represents capture progress only. No image or video is recorded.",
  },
  complete: {
    title: "Static capture completed",
    description: "The mock gateway is preparing the selected result state.",
  },
  denied: {
    title: "Camera permission was declined",
    description:
      "This demonstrates the recovery message shown when camera access is unavailable.",
  },
};

function StateIcon({ state }: { state: SelfieFrameState }) {
  if (state === "denied") return <CameraOff size={34} />;
  if (state === "complete") return <Check size={34} />;
  if (state === "requesting" || state === "capturing") {
    return <LoaderCircle className={styles.rotating} size={34} />;
  }
  if (state === "ready") return <ScanFace size={34} />;
  return <Camera size={34} />;
}

export function SelfieFrame({ state, progress = 0 }: SelfieFrameProps) {
  const copy = stateCopy[state];

  return (
    <section className={cn(styles.frame, styles[state])} aria-live="polite">
      <div className={styles.viewport}>
        <span className={styles.cornerTopLeft} aria-hidden="true" />
        <span className={styles.cornerTopRight} aria-hidden="true" />
        <span className={styles.cornerBottomLeft} aria-hidden="true" />
        <span className={styles.cornerBottomRight} aria-hidden="true" />

        <div className={styles.faceGuide} aria-hidden="true">
          <span className={styles.head} />
          <span className={styles.shoulders} />
        </div>

        <span className={styles.stateIcon} aria-hidden="true">
          <StateIcon state={state} />
        </span>
      </div>

      <div className={styles.copy}>
        <strong>{copy.title}</strong>
        <p>{copy.description}</p>
      </div>

      {state === "capturing" && (
        <ProgressBar
          value={progress}
          label="Static capture progress"
          showValue
        />
      )}
    </section>
  );
}
