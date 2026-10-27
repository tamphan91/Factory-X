import { cva } from "class-variance-authority";
import { DeltaIndicator } from "./delta-indicator";
import { KpiCardShell } from "./kpi-card-shell";
import type { LeadTimeKpiCardProps } from "./lead-time-kpi-card.props";
import { Sparkline } from "./sparkline";

const valueVariants = cva("text-3xl font-bold", {
  variants: {
    tone: {
      good: "text-fx-ink",
      info: "text-fx-ink",
      warning: "text-fx-warning",
      critical: "text-fx-danger",
      bad: "text-fx-danger",
      late: "text-fx-danger",
      unavailable: "text-fx-slate",
      neutral: "text-fx-ink",
    },
  },
});

export function LeadTimeKpiCard({
  title,
  value,
  valueTone,
  unit = "min",
  target,
  delta,
  trend,
  process,
}: LeadTimeKpiCardProps) {
  return (
    <KpiCardShell title={title}>
      <div className="flex justify-between">
        <div>
          <div className={valueVariants({ tone: valueTone })}>
            {value} {unit}
          </div>
          <div className="text-slate-500">
            Target ≤ {target} {unit}
          </div>
        </div>

        {delta && (
          <DeltaIndicator
            text={delta.text}
            tone={delta.tone}
            caption="(vs. yesterday)"
          />
        )}
      </div>

      {trend.length > 0 ? (
        <Sparkline data={trend} process={process} />
      ) : (
        <div className="text-xs text-fx-muted">No data</div>
      )}
    </KpiCardShell>
  );
}
