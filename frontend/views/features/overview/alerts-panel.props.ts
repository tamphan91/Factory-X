import type { AlertSeverity } from "@/models/types/alert";
import type { AlertItemProps } from "./alert-item.props";

export type AlertFilter = AlertSeverity | "all";

export interface AlertItemVM extends AlertItemProps {
  id: string;
}

export interface AlertsPanelProps {
  /** Already filtered. */
  items: AlertItemVM[];
  /** Total of all alerts, shown in the header whatever the filter. */
  total: number;
  filter: AlertFilter;
  onFilterChange: (filter: AlertFilter) => void;
  /** Sets the filter back to "all". */
  onViewAll: () => void;
}
