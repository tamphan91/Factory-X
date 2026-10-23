import { KpiCardShell } from "../dashboard/kpi-card-shell";
import { GaugeChart } from "../dashboard/gauge-chart";

export function SupplyRateCard() {
  return (
    <KpiCardShell>
      <h3 className="font-extrabold">
        Material Supply On-time Rate
      </h3>

      <div className="flex justify-between items-center">

        <div className="w-[130px]">
          <GaugeChart
            value={96}
            color="#29b35f"
          />
        </div>

        <div className="flex-1 px-2">

          <div className="text-sm font-bold">
            192 / 200
          </div>

          <div className="text-slate-600 text-sm">
            Delivered on time
          </div>

          <div className="mt-3 text-red-500 font-bold text-sm">
            8
          </div>

          <div className="text-slate-600 text-sm">
            Overdue
          </div>

        </div>

        <div className="text-right">

          <div className="text-green-500 font-bold">
            ↑ +2%
          </div>

          <div className="text-xs text-slate-500">
            (vs. yesterday)
          </div>

        </div>

      </div>
    </KpiCardShell>
  );
}