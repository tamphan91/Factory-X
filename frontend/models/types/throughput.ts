import type { ProcessKey } from "@/models/domain/process";

export type ThroughputItem = {
  /** Decides the colour. */
  process: ProcessKey;
  /** "Picking / Kitting" */
  label: string;
  /** Pallets. */
  actual: number;
  /** Pallets; drawn by the vertical card only. */
  target?: number;
};
