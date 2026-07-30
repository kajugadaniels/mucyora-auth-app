"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { forwardRef, useState, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./PasswordInput.module.css";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";

export type PasswordInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "type" | "icon" | "rightAction"
>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        {...props}
        ref={ref}
        className={cn(styles.root, className)}
        type={visible ? "text" : "password"}
        icon={<LockKeyhole size={16} />}
        rightAction={
          <IconButton
            size="sm"
            variant="plain"
            label={visible ? "Hide password" : "Show password"}
            icon={visible ? <EyeOff /> : <Eye />}
            onClick={() => setVisible((current) => !current)}
          />
        }
      />
    );
  },
);
