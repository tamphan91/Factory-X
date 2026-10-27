import { KpiCardShell } from "@/views/common/kpi-card-shell";
import { ProgressBar } from "@/views/common/progress-bar";
import type { ThroughputHorizontalCardProps } from "./throughput-card.props";

export function ThroughputHorizontalCard({
  items,
  unit = "pallets",
  periodLabel = "Today",
}: ThroughputHorizontalCardProps) {
  return (
    <KpiCardShell>
      <div className="flex items-center justify-between">
        <div className="font-extrabold text-slate-900">
          Throughput
          <span className="ml-1 text-xs font-normal text-slate-500">
            ({periodLabel})
          </span>
        </div>
        <div className="text-xs text-slate-500">({unit})</div>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={item.process}
            className="grid grid-cols-[110px_1fr_36px] items-center gap-3"
          >
            <div className="text-xs text-slate-800">{item.label}</div>
            <ProgressBar
              percent={item.barPercent}
              appearance={{ process: item.process }}
              label={item.label}
            />
            <div className="text-right font-bold text-slate-900">{item.actual}</div>
          </div>
        ))}
      </div>
    </KpiCardShell>
  );
}
