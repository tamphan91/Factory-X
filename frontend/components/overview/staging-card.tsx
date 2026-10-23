import { GaugeChart } from "../dashboard/gauge-chart";
import { KpiCardShell } from "../dashboard/kpi-card-shell";

export function StagingCard() {
  return (
    <KpiCardShell>

      <h3 className="font-extrabold">
        Staging Occupancy
      </h3>

      <div className="flex justify-between items-center">

        <div className="w-[130px]">

          <GaugeChart
            value={78}
            color="#f1b500"
          />

        </div>

        <div className="flex-1 px-2">

          <div className="text-sm font-bold">
            78 / 100
          </div>

          <div className="text-muted-foreground">
            Used Slots
          </div>

          <div className="mt-3 text-sm font-bold">
            22
          </div>

          <div>
            Available
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