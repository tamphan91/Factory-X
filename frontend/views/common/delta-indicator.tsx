import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { DeltaIndicatorProps } from "./delta-indicator.props";

const deltaVariants = cva("font-bold", {
  variants: {
    tone: {
      good: "text-fx-success",
      info: "text-fx-info",
      warning: "text-fx-warning",
      critical: "text-fx-danger",
      bad: "text-fx-danger",
      late: "text-fx-danger",
      unavailable: "text-fx-slate",
      neutral: "text-fx-ink",
    },
  },
  defaultVariants: { tone: "neutral" },
});

const arrowOf = (text: string): string =>
  text.startsWith("+") ? "↑" : text.startsWith("-") ? "↓" : "";

export function DeltaIndicator({ text, tone, caption }: DeltaIndicatorProps) {
  const arrow = arrowOf(text);

  return (
    <div className="text-right">
      <div className={cn(deltaVariants({ tone }))}>
        {arrow && <span aria-hidden="true">{arrow} </span>}
        {text}
      </div>
      {caption && <div className="text-xs text-fx-muted">{caption}</div>}
    </div>
  );
}
