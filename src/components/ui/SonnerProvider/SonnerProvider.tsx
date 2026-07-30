"use client";

import { Toaster } from "sonner";
import { uiConfig } from "@/config/ui.config";
import styles from "./SonnerProvider.module.css";

export function SonnerProvider() {
  return (
    <Toaster
      position={uiConfig.toast.position}
      duration={uiConfig.toast.durationMs}
      visibleToasts={uiConfig.toast.visibleToasts}
      closeButton
      toastOptions={{
        className: styles.toast,
        classNames: {
          title: styles.title,
          description: styles.description,
          actionButton: styles.actionButton,
          cancelButton: styles.cancelButton,
          closeButton: styles.closeButton,
        },
      }}
    />
  );
}