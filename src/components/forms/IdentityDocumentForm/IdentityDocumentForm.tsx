"use client";

import { ArrowRight, FileImage, ShieldCheck, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ImageField } from "@/components/ui/ImageField";
import { LinkButton } from "@/components/ui/LinkButton";
import { SelectField } from "@/components/ui/SelectField";
import { authFlowConfig } from "@/config/auth-flow.config";
import { identityDocumentFormSchema } from "@/lib/validation/identity.schemas";
import { authGateway } from "@/mocks/services/MockAuthGateway";
import {
  isAuthGatewayError,
  type IdentityDocumentScenario,
  type UploadResult,
} from "@/services/auth";
import styles from "./IdentityDocumentForm.module.css";

const scenarioOptions = [
  { value: "success", label: "Successful media preparation" },
  { value: "rejected", label: "Media rejected" },
  { value: "unavailable", label: "Storage provider unavailable" },
];

export function IdentityDocumentForm() {
  const [file, setFile] = useState<File | null>(null);
  const [scenario, setScenario] = useState<IdentityDocumentScenario>("success");
  const [error, setError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearProgressTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    setError(undefined);
    setResult(null);
    setUploadProgress(0);
  }

  async function submit() {
    setError(undefined);
    setResult(null);

    const parsed = identityDocumentFormSchema.safeParse({ file, scenario });

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Choose a valid identity image.";
      setError(message);
      toast.error("Check the selected image", { description: message });
      return;
    }

    setIsUploading(true);
    setUploadProgress(8);

    intervalRef.current = setInterval(() => {
      setUploadProgress((current) =>
        current >= 88 ? current : Math.min(88, current + 8),
      );
    }, 180);

    try {
      const upload = await authGateway.submitIdentityDocument(parsed.data);
      clearProgressTimer();
      setUploadProgress(100);
      setResult(upload);
      toast.success("Identity image prepared", {
        description:
          "No file was uploaded. The mock gateway returned a local demonstration reference.",
      });
    } catch (caught) {
      clearProgressTimer();
      setUploadProgress(0);

      if (isAuthGatewayError(caught) && caught.code === "MEDIA_REJECTED") {
        const message =
          "The static media checks rejected this demonstration scenario. Replace the image or select the successful scenario.";
        setError(message);
        toast.error("Image not accepted", { description: message });
        return;
      }

      if (
        isAuthGatewayError(caught) &&
        caught.code === "PROVIDER_UNAVAILABLE"
      ) {
        toast.error("Demonstration storage unavailable", {
          description:
            "The selected image remains only in this browser page and was not uploaded.",
        });
        return;
      }

      toast.error("The image could not be prepared");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={styles.form}>
      {result && (
        <Alert variant="success" title="Static document step completed">
          The local mock reference is <strong>{result.uploadReference}</strong>.
          No image left your device.
        </Alert>
      )}

      <ImageField
        label="Identity image"
        icon={<FileImage size={22} />}
        accept={[...authFlowConfig.image.acceptedTypes]}
        maxSizeBytes={authFlowConfig.image.maximumBytes}
        value={file}
        error={error}
        hint="Choose a fake or non-sensitive JPEG or PNG image for this static demonstration."
        disabled={isUploading}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onChange={handleFileChange}
      />

      <div className={styles.scenario}>
        <SelectField
          label="Static upload result"
          icon={<ShieldCheck size={16} />}
          value={scenario}
          options={scenarioOptions}
          disabled={isUploading}
          onChange={(event) => {
            setScenario(event.target.value as IdentityDocumentScenario);
            setResult(null);
          }}
          hint="This development control changes only the local mock response."
        />
      </div>

      <div className={styles.actions}>
        <Button
          icon={<UploadCloud size={16} />}
          isLoading={isUploading}
          loadingText="Preparing image"
          disabled={!file || Boolean(result)}
          onClick={submit}
          fullWidth
        >
          Prepare identity image
        </Button>

        {result && (
          <LinkButton
            href="/identity-verification/live-check"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            fullWidth
          >
            Continue to live check
          </LinkButton>
        )}
      </div>

      <p className={styles.privacy}>
        This static phase creates an in-browser preview only. It does not send
        the file to MUCYORA, object storage, NIDA, or the biometric Engine.
      </p>
    </div>
  );
}
