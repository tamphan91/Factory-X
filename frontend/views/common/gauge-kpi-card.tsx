import { cva } from "class-variance-authority";
import { DeltaIndicator } from "./delta-indicator";
import { DonutGauge } from "./donut-gauge";
import type { GaugeKpiBaseProps } from "./gauge-kpi-card.props";
import { KpiCardShell } from "./kpi-card-shell";

const noticeVariants = cva("mt-3 text-sm font-bold", {
  variants: {
    tone: {
      good: "text-fx-ink",
      info: "text-fx-info",
      warning: "text-fx-warning",
      critical: "text-fx-danger",
      bad: "text-fx-danger",
      late: "text-fx-danger",
      unavailable: "text-fx-slate",
      neutral: "text-fx-ink",
    },
  },
});

const format = (value: number) => value.toLocaleString("en-US");

export function GaugeKpiCard({
  title,
  currentStats,
  currentOverview,
  currentNotice,
  percent,
  ringTone,
  delta,
}: GaugeKpiBaseProps) {
  return (
    <KpiCardShell title={title}>
      <div className="flex items-center justify-between">
        <div className="w-[130px]">
          <DonutGauge percent={percent} appearance={{ tone: ringTone }} />
        </div>

        <div className="flex-1 px-2">
          <div className="text-sm font-bold">
            {format(currentStats.current)} / {format(currentStats.total)}
          </div>
          <div className="text-sm text-slate-600">{currentOverview}</div>

          <div className={noticeVariants({ tone: currentNotice.tone })}>
            {format(currentNotice.value)}
          </div>
          <div className="text-sm text-slate-600">{currentNotice.label}</div>
        </div>

        {delta && (
          <DeltaIndicator
            text={delta.text}
            tone={delta.tone}
            caption="(vs. yesterday)"
          />
        )}
      </div>
    </KpiCardShell>
  );
}
