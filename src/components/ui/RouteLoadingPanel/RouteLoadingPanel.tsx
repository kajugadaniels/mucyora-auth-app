import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import styles from "./RouteLoadingPanel.module.css";

export interface RouteLoadingPanelProps {
  title?: string;
  description?: string;
}

export function RouteLoadingPanel({
  title = "Preparing this step",
  description = "The interface is loading the controls required for this page.",
}: RouteLoadingPanelProps) {
  return (
    <div
      className={styles.panel}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner size="md" label={title} />

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
