import type { ReactNode } from "react";

export interface KpiCardShellProps {
  /** Rendered as the card heading when given. */
  title?: string;
  children: ReactNode;
}
