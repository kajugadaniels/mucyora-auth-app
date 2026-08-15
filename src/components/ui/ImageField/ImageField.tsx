"use client";

import Image from "next/image";
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { FieldMessage } from "@/components/ui/FieldMessage";
import { IconButton } from "@/components/ui/IconButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils/cn";
import styles from "./ImageField.module.css";

export interface ImageFieldProps {
  label: string;
  icon?: ReactNode;
  accept: string[];
  maxSizeBytes: number;
  value?: File | null;
  previewUrl?: string;
  error?: string;
  hint?: string;
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  onChange: (file: File | null) => void;
}

export function ImageField({
  label,
  icon = <ImagePlus size={22} />,
  accept,
  maxSizeBytes,
  value,
  previewUrl,
  error,
  hint,
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  onChange,
}: ImageFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const objectUrl = useMemo(
    () => (value && !previewUrl ? URL.createObjectURL(value) : undefined),
    [previewUrl, value],
  );

  const activeError = error ?? localError;
  const isInteractive = !disabled && !isUploading;

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  function validate(file: File): string | undefined {
    if (!accept.includes(file.type)) {
      return `Choose one of these image types: ${accept.join(", ")}.`;
    }

    if (file.size > maxSizeBytes) {
      return `The image must be smaller than ${(
        maxSizeBytes /
        1024 /
        1024
      ).toFixed(1)} MB.`;
    }

    return undefined;
  }

  function choose(file?: File) {
    if (!file || !isInteractive) {
      return;
    }

    const validationError = validate(file);
    setLocalError(validationError);

    if (validationError) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    onChange(file);
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);

    if (!isInteractive) {
      return;
    }

    choose(event.dataTransfer.files[0]);
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!isInteractive) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  function remove() {
    if (!isInteractive) {
      return;
    }

    setLocalError(undefined);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const displayedPreview = previewUrl ?? objectUrl;
  const describedBy = activeError
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        <span className={styles.requirement}>
          {accept.map((type) => type.split("/")[1]?.toUpperCase()).join(", ")} ·
          max {(maxSizeBytes / 1024 / 1024).toFixed(1)} MB
        </span>
      </div>

      <input
        ref={inputRef}
        id={id}
        className={styles.input}
        type="file"
        accept={accept.join(",")}
        disabled={!isInteractive}
        onChange={(event) => choose(event.target.files?.[0])}
      />

      {displayedPreview ? (
        <div
          className={cn(
            styles.dropzone,
            activeError && styles.error,
            !isInteractive && styles.disabled,
          )}
          aria-describedby={describedBy}
        >
          <div className={styles.preview}>
            <Image
              src={displayedPreview}
              alt="Selected image preview"
              width={720}
              height={420}
              unoptimized
            />
            <div className={styles.previewOverlay}>
              <span>{value?.name ?? "Selected image"}</span>
              <div className={styles.previewActions}>
                <IconButton
                  label="Replace selected image"
                  icon={<RefreshCw />}
                  variant="bordered"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={!isInteractive}
                />
                <IconButton
                  label="Remove selected image"
                  icon={<Trash2 />}
                  variant="danger"
                  size="sm"
                  onClick={remove}
                  disabled={!isInteractive}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            styles.dropzone,
            dragging && styles.dragging,
            activeError && styles.error,
            !isInteractive && styles.disabled,
          )}
          role="button"
          tabIndex={isInteractive ? 0 : -1}
          aria-disabled={!isInteractive}
          aria-describedby={describedBy}
          onClick={() => isInteractive && inputRef.current?.click()}
          onKeyDown={keyboard}
          onDragOver={(event) => {
            event.preventDefault();
            if (isInteractive) {
              setDragging(true);
            }
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={drop}
        >
          <div className={styles.empty}>
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
            <strong>Drop an image here or browse</strong>
            <span>Use a clear, well-lit image with all edges visible.</span>
            <span className={styles.browse}>
              <UploadCloud size={15} aria-hidden="true" /> Choose image
            </span>
          </div>
        </div>
      )}

      {isUploading && (
        <div className={styles.progress}>
          <ProgressBar
            value={uploadProgress}
            label="Preparing image"
            showValue
          />
        </div>
      )}

      {activeError ? (
        <FieldMessage id={`${id}-error`} variant="error">
          {activeError}
        </FieldMessage>
      ) : hint ? (
        <FieldMessage id={`${id}-hint`}>{hint}</FieldMessage>
      ) : null}
    </div>
  );
}
