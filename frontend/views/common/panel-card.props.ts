import type { ReactNode } from "react";

export interface PanelCardProps {
  title: string;
  subtitle?: string;
  /** Right side of the header, for example a FilterSelect. */
  actions?: ReactNode;
  /** Tailwind classes for the size of the card, for example "h-[480px]". */
  className?: string;
  children: ReactNode;
}
