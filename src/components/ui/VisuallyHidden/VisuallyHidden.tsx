import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./VisuallyHidden.module.css";

export function VisuallyHidden({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(styles.hidden, className)} {...props} />;
}