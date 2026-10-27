import type { ThroughputItem } from "@/models/types/throughput";

/** barPercent is computed in the controller. */
export type ThroughputItemVM = ThroughputItem & { barPercent: number };

export type ThroughputMode = "actual" | "target";

type ThroughputCardBase = {
  /** The same array feeds both orientations. */
  items: ThroughputItemVM[];
  /** Default "pallets". */
  unit?: string;
};

export type ThroughputHorizontalCardProps = ThroughputCardBase & {
  orientation: "horizontal";
  /** "Today" */
  periodLabel?: string;
};

export type ThroughputVerticalCardProps = ThroughputCardBase & {
  orientation: "vertical";
  /** "actual" shows actual only; "target" shows actual vs target. */
  mode: ThroughputMode;
  /** Computed in the controller. */
  axisMax: number;
  onModeChange: (mode: ThroughputMode) => void;
};

export type ThroughputCardProps =
  | ThroughputHorizontalCardProps
  | ThroughputVerticalCardProps;
