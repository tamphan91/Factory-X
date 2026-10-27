import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PROCESS_COLOR } from "@/models/domain/process";
import type { ProgressBarProps } from "./progress-bar.props";

const fillVariants = cva("h-full rounded-md", {
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
});

export function ProgressBar({
  percent,
  appearance,
  heightClass = "h-3",
  label,
}: ProgressBarProps) {
  const width = `${Math.min(100, Math.max(0, percent))}%`;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={cn("overflow-hidden rounded-md bg-slate-200", heightClass)}
    >
      {"tone" in appearance ? (
        <div className={fillVariants({ tone: appearance.tone })} style={{ width }} />
      ) : (
        <div
          className="h-full rounded-md"
          style={{ width, backgroundColor: PROCESS_COLOR[appearance.process] }}
        />
      )}
    </div>
  );
}
