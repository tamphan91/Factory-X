"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DashboardHeader() {
    return (
        <header className="bg-[#081c4b] text-white">
            <div className="px-4 pt-2">
                <div className="flex justify-between ">
                    <div className="flex align-center gap-4">
                        <h1 className="text-5xl font-bold">
                            FactoryX
                        </h1>
                        <div>
                            <h2 className="text-xl font-extrabold">
                                FactoryX – Logistics Control Tower
                            </h2>
                            <p className=" text-xs text-blue-200">
                                Real-time Visibility |
                                Forecast |
                                Bottleneck Detection |
                                Simulation |
                                Recommendation
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-8">
                        <div>
                            <div className="text-xs mb-1">
                                Time Range
                            </div>

                            <Select defaultValue="today">
                                <SelectTrigger className="w-[160px] bg-white text-black">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="today">
                                        Today
                                    </SelectItem>
                                    <SelectItem value="yesterday">
                                        Yesterday
                                    </SelectItem>
                                    <SelectItem value="week">
                                        Last 7 Days
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-right">
                            <div className="text-sm">
                                <span className="text-green-400 text-xl mr-1">●</span>Live (5 min refresh)
                            </div>
                            <span className="text-sm">
                                2026/10/23 13:47
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}