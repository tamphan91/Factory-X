"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/views/common/ui/select";
import Image from "next/image";
import LogoutButton from "./logout-button";

export function DashboardHeader() {
    return (
        <header className="bg-[#081c4b] text-white">
            <div className="px-4 py-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    {/* LEFT: Logo + Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        {/* Logo */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex items-center">
                            Factory

                            <Image
                                src="/images/logo.png"
                                alt="FactoryX Logo"
                                height={80}
                                width={80}
                                className="w-14 h-14 lg:w-20 lg:h-20"
                            />
                        </h1>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg lg:text-xl font-extrabold">
                                FactoryX – Logistics Control Tower
                            </h2>

                            <p className="text-xs text-blue-200 mt-1">
                                Real-time Visibility |
                                Forecast |
                                Bottleneck Detection |
                                Simulation |
                                Recommendation
                            </p>
                        </div>
                    </div>

                    {/* RIGHT: Controls */}
                    <div className="flex flex-col justify-between sm:flex-row sm:items-end lg:items-center gap-4 lg:gap-8">

                        {/* Time Range */}
                        <div>
                            <div className="text-xs mb-1">
                                Time Range
                            </div>

                            <Select defaultValue="today">
                                <SelectTrigger className="sm:w-[160px] bg-white text-black">
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

                        {/* Status */}
                        <div className="text-left sm:text-right">
                            <div className="text-sm">
                                <span className="text-green-400 text-xl mr-1">
                                    ●
                                </span>
                                Live (5 min refresh)
                            </div>

                            <div className="text-sm">
                                2026/10/23 13:47
                            </div>

                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}