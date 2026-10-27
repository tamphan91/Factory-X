"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = [
  {
    zone: "A",
    area: "Storage",
    type: "RM",
    occupancy: 72,
    queue: 3,
    leadTime: 22,
    status: "Normal",
  },
  {
    zone: "B",
    area: "Storage",
    type: "RM",
    occupancy: 85,
    queue: 8,
    leadTime: 35,
    status: "Warning",
  },
  {
    zone: "C",
    area: "Storage",
    type: "RM",
    occupancy: 60,
    queue: 2,
    leadTime: 18,
    status: "Normal",
  },
  {
    zone: "D",
    area: "Storage",
    type: "RM",
    occupancy: 45,
    queue: 4,
    leadTime: 20,
    status: "Normal",
  },
  {
    zone: "E",
    area: "Storage",
    type: "RM",
    occupancy: 90,
    queue: 10,
    leadTime: 40,
    status: "Critical",
  },
  {
    zone: "F",
    area: "Storage",
    type: "RM",
    occupancy: 68,
    queue: 5,
    leadTime: 25,
    status: "Warning",
  },
  {
    zone: "G",
    area: "Picking/Kitting",
    type: "PK",
    occupancy: 80,
    queue: 12,
    leadTime: 28,
    status: "Warning",
  },
  {
    zone: "H",
    area: "Picking/Kitting",
    type: "PK",
    occupancy: 65,
    queue: 6,
    leadTime: 20,
    status: "Normal",
  },
  {
    zone: "I",
    area: "Picking/Kitting",
    type: "PK",
    occupancy: 50,
    queue: 4,
    leadTime: 18,
    status: "Normal",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Critical":
      return "text-red-500";

    case "Warning":
      return "text-amber-500";

    default:
      return "text-green-500";
  }
}

function getOccupancyBg(value: number) {
  if (value >= 90) {
    return "bg-red-100 text-red-600";
  }

  if (value >= 80) {
    return "bg-amber-100 text-amber-700";
  }

  return "";
}

export function ZonePerformanceTable() {
  return (
    <Card  className="p-4 h-[430px] rounded-xl shadow-sm">

        <div className="flex justify-between items-center mb-4">

          <div>

            <h3 className="font-bold text-lg">
              Zone Performance
            </h3>

            <div className="text-sm text-slate-500">
              (Today)
            </div>

          </div>

          <Select defaultValue="all">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="All Areas">
                All Areas
              </SelectItem>

              <SelectItem value="Storage">
                Storage
              </SelectItem>

              <SelectItem value="Picking">
                Picking
              </SelectItem>
            </SelectContent>
          </Select>

        </div>

        <div className="overflow-auto h-[340px]">

          <Table className="text-sm">

            <TableHeader className="font-bold whitespace-nowrap">

              <TableRow>

                <TableHead>
                  Zone
                </TableHead>

                <TableHead>
                  Area
                </TableHead>

                <TableHead>
                  Type
                </TableHead>

                <TableHead>
                  Occupancy
                </TableHead>

                <TableHead>
                  Queue
                </TableHead>

                <TableHead>
                  Lead Time
                </TableHead>

                <TableHead>
                  Status
                </TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {rows.map((row) => (

                <TableRow key={row.zone}>

                  <TableCell>
                    {row.zone}
                  </TableCell>

                  <TableCell>
                    {row.area}
                  </TableCell>

                  <TableCell>
                    {row.type}
                  </TableCell>

                  <TableCell>

                    <div
                      className={`
                        inline-flex
                        min-w-[60px]
                        justify-center
                        rounded
                        px-2
                        py-1
                        font-medium
                        ${getOccupancyBg(
                          row.occupancy
                        )}
                      `}
                    >
                      {row.occupancy}%
                    </div>

                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        row.queue >= 8
                          ? "text-red-500 font-semibold"
                          : ""
                      }
                    >
                      {row.queue}
                    </span>
                  </TableCell>

                  <TableCell>

                    <span
                      className={
                        row.leadTime >= 30
                          ? "text-red-500 font-semibold"
                          : ""
                      }
                    >
                      {row.leadTime}
                    </span>

                  </TableCell>

                  <TableCell>

                    <div
                      className={`
                      flex
                      items-center
                      gap-2
                      ${getStatusColor(
                        row.status
                      )}
                    `}
                    >
                      <span>
                        ●
                      </span>

                      <span>
                        {row.status}
                      </span>
                    </div>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>

    </Card>
  );
}