"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import styles from "./ResetPasswordExperience.module.css";
export function ResetPasswordExperience() {
  const token = useSearchParams().get("token") || undefined;
  useEffect(() => {
    if (!token) return; const url = new URL(window.location.href); url.searchParams.delete("token"); window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [token]);
  return <div className={styles.experience}>{token ? <ResetPasswordForm token={token} /> : <Alert variant="warning" title="Recovery link required">Open the single-use link sent by MUCYORA to reset your password.</Alert>}</div>;
}
