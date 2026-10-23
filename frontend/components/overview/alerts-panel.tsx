"use client";

import {
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";

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

const alerts = [
  {
    level: "critical",
    title: "Picking / Kitting Queue High",
    detail:
      "Zone I | Queue: 12 tasks | Lead time: 28 min",
    time: "14:25",
  },
  {
    level: "warning",
    title: "Staging Capacity High",
    detail:
      "Staging 3 | Occupancy: 90%",
    time: "14:18",
  },
  {
    level: "warning",
    title: "Zone E Storage High",
    detail:
      "Occupancy: 90%",
    time: "13:50",
  },
  {
    level: "info",
    title: "Inbound Delay",
    detail:
      "Dock 2 | Waiting 45 mins",
    time: "13:40",
  },
  {
    level: "info",
    title: "AGV-03 Offline",
    detail:
      "Battery low",
    time: "13:32",
  },
  {
    level: "info",
    title: "Material Delivery Delay",
    detail:
      "Required: 8 kits",
    time: "13:25",
  },
];

function getAlertStyle(level: string) {
  switch (level) {
    case "critical":
      return {
        icon: (
          <AlertCircle
            className="text-white"
            size={18}
          />
        ),
        bg: "bg-red-500",
      };

    case "warning":
      return {
        icon: (
          <AlertTriangle
            className="text-black"
            size={18}
          />
        ),
        bg: "bg-yellow-400",
      };

    default:
      return {
        icon: (
          <Info
            className="text-white"
            size={18}
          />
        ),
        bg: "bg-blue-500",
      };
  }
}

export function AlertsPanel() {
  return (
    <Card className="h-[480px]  
                    rounded-xl
                    border
                    bg-white
                    shadow-sm
                    p-3">

        <div className="flex justify-between items-center">

            <h3 className="font-extrabold">
        
            Active Alerts (6)
          </h3>

          <div className="flex gap-2">

            <Select
              defaultValue="All"
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="All">
                  All Alerts
                </SelectItem>

                <SelectItem value="Critical">
                  Critical
                </SelectItem>

                <SelectItem value="Warning">
                  Warning
                </SelectItem>

              </SelectContent>
            </Select>

          </div>

        </div>


        <div className="space-y-2">

          {alerts.map(alert => {

            const style =
              getAlertStyle(alert.level);

            return (
              <div
                key={alert.title}
                className="
                flex
                items-center
                bg-red-50
                rounded-md
                border-l-4
                border-red-500
                p-2
                "
              >
                <div
                  className={`
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    ${style.bg}
                  `}
                >
                  {style.icon}
                </div>

                <div className="ml-3 flex-1">

                  <div className="font-bold">
                    {alert.title}
                  </div>

                  <div
                    className="
                    text-xs
                    text-muted-foreground
                    "
                  >
                    {alert.detail}
                  </div>

                </div>

                <div
                  className="
                  text-xs
                  text-slate-500
                  "
                >
                  {alert.time}
                </div>

              </div>
            );
          })}
        </div>
    </Card>
  );
}