import { Sparkline } from "../charts/sparkline";
import { KpiCardShell } from "../dashboard/kpi-card-shell";

export function InboundLeadtimeCard() {
    return (
        <KpiCardShell>

            <h3 className="font-extrabold">
                Inbound Lead Time
            </h3>

            <div className="flex justify-between">
                <div>
                    <div className="text-3xl font-bold">
                        42 min
                    </div>
                    <div className="text-slate-500">
                        Target ≤ 60 min
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-green-500 font-bold">
                        ↓ -15%
                    </div>
                    <div className="text-xs text-slate-500">
                        (vs. yesterday)
                    </div>
                </div>
            </div>


            <Sparkline
                color="#3478f6"
                data={[
                    37, 39, 38, 43, 40,
                    45, 42, 47, 44, 49,
                    46, 50, 52, 48, 51,
                    54, 53, 58
                ]}
            />

        </KpiCardShell>
    );
}