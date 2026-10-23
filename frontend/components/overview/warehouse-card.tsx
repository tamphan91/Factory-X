import { GaugeChart } from "../dashboard/gauge-chart";
import { KpiCardShell } from "../dashboard/kpi-card-shell";

export function WarehouseCard() {
    return (
        <KpiCardShell>

            <h3 className="font-extrabold">
                Warehouse Occupancy
            </h3>

            <div className="flex justify-between items-center">

                <div className="w-[130px]">
                    <GaugeChart
                        value={68}
                        color="#27ae60"
                    />
                </div>

                <div className="flex-1 px-2">

                    <div className="text-sm font-bold">
                        6,800 / 10,000
                    </div>

                    <div className="text-muted-foreground">
                        Pallet Locations
                    </div>

                    <div className="mt-3 text-sm font-bold">
                        3,200
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