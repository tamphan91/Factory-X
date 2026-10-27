import type { ProcessKey } from "@/models/domain/process";
import type { Tone } from "@/models/domain/tone";

const TONE_TOKEN: Record<Tone, string> = {
  good: "--fx-success",
  info: "--fx-info",
  warning: "--fx-caution",
  critical: "--fx-danger",
  bad: "--fx-danger",
  late: "--fx-danger",
  unavailable: "--fx-slate",
  neutral: "--fx-primary",
};

const PROCESS_TOKEN: Record<ProcessKey, string> = {
  inbound: "--fx-process-inbound",
  putaway: "--fx-process-putaway",
  picking: "--fx-process-picking",
  delivery: "--fx-process-delivery",
};

// Used when the document is not available (server render). Keep in sync with app/globals.css.
const FALLBACK: Record<string, string> = {
  "--fx-success": "#1fb46b",
  "--fx-info": "#2f7cf6",
  "--fx-caution": "#f2c200",
  "--fx-danger": "#e5413e",
  "--fx-slate": "#7b8db3",
  "--fx-primary": "#2f7cf6",
  "--fx-process-inbound": "#2f7cf6",
  "--fx-process-putaway": "#1fb46b",
  "--fx-process-picking": "#f59a23",
  "--fx-process-delivery": "#8b5cf6",
};

/** ECharts needs a real colour string, so resolve the CSS variable. */
const resolveToken = (token: string): string => {
  if (typeof document === "undefined") {
    return FALLBACK[token];
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  return value || FALLBACK[token];
};

export const toneColor = (tone: Tone): string => resolveToken(TONE_TOKEN[tone]);

export const processColor = (process: ProcessKey): string =>
  resolveToken(PROCESS_TOKEN[process]);
