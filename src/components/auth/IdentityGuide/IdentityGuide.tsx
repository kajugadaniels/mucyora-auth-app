import { Camera, Eye, Lightbulb, ShieldCheck, Smartphone } from "lucide-react";
import styles from "./IdentityGuide.module.css";

const guidance = [
  {
    icon: Lightbulb,
    title: "Use even lighting",
    description:
      "Avoid strong shadows, glare, and bright light directly behind you.",
  },
  {
    icon: Camera,
    title: "Prepare a clear identity image",
    description:
      "Keep the full image visible, sharp, and free from fingers or reflections.",
  },
  {
    icon: Eye,
    title: "Keep your face visible",
    description:
      "Remove masks, dark glasses, hats, or anything that covers your face.",
  },
  {
    icon: Smartphone,
    title: "Hold the device steady",
    description:
      "Keep the camera at eye level and remain centered during the guided check.",
  },
];

export function IdentityGuide() {
  return (
    <section className={styles.guide} aria-labelledby="identity-guide-title">
      <div className={styles.heading}>
        <span className={styles.headingIcon} aria-hidden="true">
          <ShieldCheck size={19} />
        </span>

        <div>
          <h2 id="identity-guide-title">Prepare for a clear verification</h2>
          <p>
            These steps improve capture quality and reduce unnecessary retries.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {guidance.map(({ icon: Icon, title, description }) => (
          <article className={styles.item} key={title}>
            <span className={styles.icon} aria-hidden="true">
              <Icon size={18} />
            </span>

            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
