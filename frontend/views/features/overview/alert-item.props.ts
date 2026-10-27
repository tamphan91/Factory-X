import type { AlertSeverity } from "@/models/types/alert";

/** Display-ready: the detail line and the clock time are formatted in the controller. */
export interface AlertItemProps {
  severity: AlertSeverity;
  title: string;
  detail: string;
  time: string;
}
