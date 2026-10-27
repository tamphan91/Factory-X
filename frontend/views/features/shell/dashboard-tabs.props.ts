import type { ReactNode } from "react";

/** Page content is passed in, so the shell does not import any page. */
export interface DashboardTabsProps {
  overview: ReactNode;
  warehouse: ReactNode;
  demand: ReactNode;
}
