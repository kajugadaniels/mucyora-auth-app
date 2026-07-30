import { CalendarDays, Flag, UserRound, UsersRound } from "lucide-react";
import type { CitizenPreview as CitizenPreviewData } from "@/services/auth";
import styles from "./CitizenPreview.module.css";

export interface CitizenPreviewProps {
  citizen: CitizenPreviewData;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function CitizenPreview({ citizen }: CitizenPreviewProps) {
  const details = [
    {
      icon: UserRound,
      label: "Full name",
      value: `${citizen.givenNames} ${citizen.surname}`,
    },
    {
      icon: CalendarDays,
      label: "Date of birth",
      value: formatDate(citizen.dateOfBirth),
    },
    {
      icon: UsersRound,
      label: "Sex",
      value: citizen.sex,
    },
    {
      icon: Flag,
      label: "Nationality",
      value: citizen.nationality,
    },
  ];

  return (
    <section className={styles.preview} aria-labelledby="citizen-preview-title">
      <header>
        <span className={styles.kicker}>Static citizen match</span>
        <h2 id="citizen-preview-title">Review the matched information</h2>
        <p>
          Confirm that this fake demonstration record represents the person you
          intended to use. A real NIDA result will never be exposed more broadly
          than required.
        </p>
      </header>

      <dl className={styles.grid}>
        {details.map(({ icon: Icon, label, value }) => (
          <div className={styles.detail} key={label}>
            <span className={styles.icon} aria-hidden="true">
              <Icon size={17} />
            </span>
            <div>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
