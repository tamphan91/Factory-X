import { Sparkline } from "../charts/sparkline";
import { KpiCardShell } from "../dashboard/kpi-card-shell";

export function PickingLeadtimeCard() {
    return (
        <KpiCardShell>
            <h3 className="font-extrabold">
                Picking / Kitting Lead Time
            </h3>

            <div className="flex justify-between">
                <div>
                    <div className="text-3xl font-bold">
                        28 min
                    </div>
                    <div className="text-slate-500">
                        Target ≤ 30 min
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-red-500 font-bold">
                        ↑ +12%
                    </div>
                    <div className="text-xs text-slate-500">
                        (vs. yesterday)
                    </div>
                </div>
            </div>
            <Sparkline
                color="#f39c12"
                data={[
                    18, 19, 18, 20, 21,
                    20, 22, 21, 23, 22,
                    24, 23, 25, 24, 26,
                    27, 26, 29
                ]}
            />
        </KpiCardShell>
    );
}