export type ProcessKey = "inbound" | "putaway" | "picking" | "delivery";

/** CSS variable per process. Identity colours: they say which process, never good or bad. */
export const PROCESS_COLOR: Record<ProcessKey, string> = {
  inbound: "var(--fx-process-inbound)",
  putaway: "var(--fx-process-putaway)",
  picking: "var(--fx-process-picking)",
  delivery: "var(--fx-process-delivery)",
};
