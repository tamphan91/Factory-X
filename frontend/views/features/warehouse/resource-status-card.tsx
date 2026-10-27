"use client";

import { Card } from "@/views/common/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/views/common/ui/tabs";

import {
  Package,
  Truck,
  Warehouse,
} from "lucide-react";

const resources = [
  {
    icon: Warehouse,
    label: "Storage (A-F)",
    used: 7,
    total: 8,
    utilization: 88,
    trend: "+6%",
    color: "#ef4444",
  },

  {
    icon: Package,
    label: "Picking (G-I)",
    used: 16,
    total: 20,
    utilization: 80,
    trend: "+5%",
    color: "#f59e0b",
  },

  {
    icon: Truck,
    label: "Staging",
    used: 6,
    total: 9,
    utilization: 67,
    trend: "+2%",
    color: "#22c55e",
  },
];

function ResourceRow({
  item,
}: {
  item: (typeof resources)[0];
}) {
  const Icon = item.icon;

  return (
    <div className="py-4 border-b last:border-b-0">

      <div className="grid grid-cols-[32px_1fr_90px] gap-3">

        {/* Icon */}

        <div className="pt-1">
          <Icon
            size={24}
            style={{
              color: item.color,
            }}
          />
        </div>

        {/* Label */}

        <div>

          <div className="font-semibold">
            {item.label}
          </div>

          <div className="text-sm text-slate-500">
            {item.used} / {item.total}
          </div>

        </div>

        {/* Progress */}

        <div className="flex items-center gap-2">

          <div className="flex-1">

            <div className="h-3 bg-slate-200 rounded">

              <div
                className="h-3 rounded"
                style={{
                  width: `${item.utilization}%`,
                  backgroundColor:
                    item.color,
                }}
              />

            </div>

          </div>

          <div className="font-bold w-[40px]">
            {item.utilization}%
          </div>

        </div>

      </div>

      <div className="flex justify-end mt-2">

        <span className="text-red-500 text-sm">
          ↑ {item.trend}
        </span>

      </div>

    </div>
  );
}

export function ResourceStatusCard() {
  return (
    <Card className="p-4 h-[430px]">

      <div className="mb-4">

        <h3 className="font-bold text-xl">
          Resource Status

          <span className="text-sm text-slate-500 ml-1">
            (Current)
          </span>

        </h3>

      </div>

      <Tabs defaultValue="type">

        <TabsList className="grid grid-cols-2 w-full">

          <TabsTrigger value="type">
            By Type
          </TabsTrigger>

          <TabsTrigger value="zone">
            By Zone
          </TabsTrigger>

        </TabsList>

      </Tabs>

      <div className="mt-4">

        {resources.map((item) => (
          <ResourceRow
            key={item.label}
            item={item}
          />
        ))}

      </div>

      <div className="mt-5 text-xs text-slate-500">

        Utilization =
        Busy Time /
        Available Time

      </div>

    </Card>
  );
}
