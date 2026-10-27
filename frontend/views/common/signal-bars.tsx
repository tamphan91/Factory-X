import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { SignalBarsProps } from "./signal-bars.props";

const litBarVariants = cva("", {
  variants: {
    tone: {
      good: "bg-fx-success",
      info: "bg-fx-info",
      warning: "bg-fx-caution",
      critical: "bg-fx-danger",
      bad: "bg-fx-danger",
      late: "bg-fx-danger",
      unavailable: "bg-fx-slate",
      neutral: "bg-fx-primary",
    },
  },
  defaultVariants: { tone: "neutral" },
});

const BAR_HEIGHTS = ["h-[5px]", "h-2", "h-[11px]", "h-3.5"];

export function SignalBars({ level, tone, label }: SignalBarsProps) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className="flex items-end gap-0.5"
    >
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={height}
          aria-hidden="true"
          className={cn(
            "w-[3px] rounded-[1px]",
            height,
            index < level ? litBarVariants({ tone }) : "bg-[var(--fx-target)]",
          )}
        />
      ))}
    </div>
  );
}
