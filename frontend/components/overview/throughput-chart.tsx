"use client";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { EChart } from "@/components/charts/echart";
import { ChartOption } from "@/types/echarts";

export function ThroughputChart() {

    const option: ChartOption = {
        tooltip: {
            trigger: "item",
        },

        grid: {
            top: 40,
            left: 50,
            right: 20,
            bottom: 40,
        },

        xAxis: {
            type: "category",

            data: [
                "Inbound",
                "Put-away",
                "Picking / Kitting",
                "Material Delivery",
            ],
        },

        yAxis: {
            type: "value",
            name: "Pallets",
        },

        series: [
            {
                type: "bar",

                barWidth: 140,

                label: {
                    show: true,
                    position: "top",
                },

                data: [
                    {
                        value: 400,
                        itemStyle: {
                            color: "#3478f6",
                        },
                    },
                    {
                        value: 380,
                        itemStyle: {
                            color: "#27ae60",
                        },
                    },
                    {
                        value: 400,
                        itemStyle: {
                            color: "#f39c12",
                        },
                    },
                    {
                        value: 350,
                        itemStyle: {
                            color: "#8b5cf6",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <Card className="h-[480px]  rounded-xl
                        border
                        bg-white
                        shadow-sm
                        p-3">

                <div className="flex justify-between items-center">

                    <h3 className="font-extrabold text-sm">
                        Throughput by Process
                    </h3>

                    <Select
                        defaultValue="Actual"
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="Actual">
                                Actual
                            </SelectItem>

                            <SelectItem value="Target">
                                Target
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <EChart
                    option={option}
                    height={390}
                />

        </Card>
    );

}