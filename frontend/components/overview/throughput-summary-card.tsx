import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { KpiCardShell } from "../dashboard/kpi-card-shell";

const items = [
    {
        name: "Inbound",
        value: 400,
        percent: 88,
        color: "#3b82f6",
    },
    {
        name: "Put-away",
        value: 380,
        percent: 83,
        color: "#27ae60",
    },
    {
        name: "Picking / Kitting",
        value: 400,
        percent: 88,
        color: "#f39c12",
    },
    {
        name: "Material Delivery",
        value: 350,
        percent: 76,
        color: "#8b5cf6",
    },
];

export function ThroughputSummaryCard() {
    return (
        <KpiCardShell>

            {/* Header */}

            <div className="flex items-center justify-between">

                <div className="font-extrabold text-slate-900">
                    Throughput
                    <span className="ml-1 text-xs font-normal text-slate-500">
                        (Today)
                    </span>
                </div>

                <div className="text-xs text-slate-500">
                    (pallets)
                </div>

            </div>

            {/* Content */}

            <div className="space-y-1">

                {items.map((item) => (
                    <div
                        key={item.name}
                        className="grid grid-cols-[110px_1fr_36px] items-center gap-3"
                    >
                        {/* Label */}

                        <div className="text-xs text-slate-800">
                            {item.name}
                        </div>

                        {/* Progress */}

                        <div className="h-3 rounded-md bg-slate-200 overflow-hidden">

                            <div
                                className="h-full rounded-md"
                                style={{
                                    width: `${item.percent}%`,
                                    backgroundColor: item.color,
                                }}
                            />

                        </div>

                        {/* Value */}

                        <div className="text-right font-bold text-slate-900">
                            {item.value}
                        </div>

                    </div>
                ))}

            </div>

        </KpiCardShell>
    );
}
