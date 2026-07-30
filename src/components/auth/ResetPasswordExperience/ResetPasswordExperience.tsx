"use client";

import { RefreshCw, TimerReset } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { authMockScenarios } from "@/mocks/scenarios/auth-scenarios";
import styles from "./ResetPasswordExperience.module.css";

export function ResetPasswordExperience() {
  const [expiredPreview, setExpiredPreview] = useState(false);
  const resetReference = expiredPreview
    ? authMockScenarios.expiredResetReference
    : authMockScenarios.validResetReference;

  return (
    <div className={styles.experience}>
      <div className={styles.previewControl} role="note">
        <div>
          <strong>Static recovery-link state</strong>
          <p>
            Switch between a valid and expired demonstration reference. No token
            is read from the URL or stored in the browser.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          icon={
            expiredPreview ? <RefreshCw size={16} /> : <TimerReset size={16} />
          }
          onClick={() => setExpiredPreview((current) => !current)}
        >
          {expiredPreview ? "Use valid demo link" : "Preview expired link"}
        </Button>
      </div>

      <ResetPasswordForm key={resetReference} resetReference={resetReference} />
    </div>
  );
}
