import type { ProcessKey } from "@/models/domain/process";

export interface SparklineProps {
  /** Any numeric array. */
  data: number[];
  /** The line always uses the process colour, never a status tone. */
  process: ProcessKey;
}
