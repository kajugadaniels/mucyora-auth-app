import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./PasswordRequirements.module.css";

export interface PasswordRequirementsProps {
  password: string;
  email?: string;
}

export function PasswordRequirements({
  password,
  email = "",
}: PasswordRequirementsProps) {
  const emailName = email.split("@")[0]?.trim().toLowerCase() ?? "";
  const guidance = [
    {
      label: "At least 15 characters",
      met: password.length >= 15,
      required: true,
    },
    {
      label: "Does not contain your email name",
      met:
        password.length > 0 &&
        (emailName.length < 3 || !password.toLowerCase().includes(emailName)),
      required: false,
    },
    {
      label: "20 or more characters for a stronger passphrase",
      met: password.length >= 20,
      required: false,
    },
  ];

  return (
    <section className={styles.panel} aria-labelledby="password-guidance-title">
      <div className={styles.heading}>
        <h3 id="password-guidance-title">Password guidance</h3>
        <span>Required and recommended checks</span>
      </div>

      <ul>
        {guidance.map((item) => {
          const Icon = item.met ? CheckCircle2 : Circle;
          return (
            <li className={cn(item.met && styles.met)} key={item.label}>
              <Icon size={15} aria-hidden="true" />
              <span>{item.label}</span>
              <small>{item.required ? "Required" : "Recommended"}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
