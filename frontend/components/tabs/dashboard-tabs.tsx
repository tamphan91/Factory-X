"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import { OverviewPage } from "@/features/overview/overview-page";
import { WarehouseOperationsPage } from "@/features/ware-house/warehouse-operations-page";

export function DashboardTabs() {
  return (
    <Tabs
      defaultValue="overview"
      className="w-full gap-0 bg-[#081c4b] text-white"

    >
      <TabsList
        className="
        !h-auto
        mx-4
        p-0
        justify-start
        rounded-none
        flex-wrap
        bg-[#081c4b]
        "
      >
        <TabsTrigger value="overview" className="text-white hover:text-blue-400 rounded-b-none">
          Overview
        </TabsTrigger>

        <TabsTrigger value="warehouse" className="text-white hover:text-blue-400 rounded-b-none">
          Warehouse Operations
        </TabsTrigger>

        <TabsTrigger value="demand" className="text-white hover:text-blue-400 rounded-b-none">
          Demand & Lead Time
        </TabsTrigger>

        <TabsTrigger value="simulation" className="grow-0 text-white hover:text-blue-400 rounded-b-none">
          Simulation & Recommendation
        </TabsTrigger>

      </TabsList>

      <TabsContent value="overview" className="mx-4 py-2 space-y-2 bg-[#081c4b] min-h-[80vh] border-t border-gray-600">
        <OverviewPage />
      </TabsContent>

      <TabsContent value="warehouse" className="mx-4 py-2 space-y-2 bg-[#081c4b] min-h-[80vh] border-t border-gray-600">
        <WarehouseOperationsPage />
      </TabsContent>

      <TabsContent value="demand" className="mx-4 py-2 space-y-2 bg-[#081c4b] min-h-[80vh] border-t border-gray-600">
        Coming Soon
      </TabsContent>

      <TabsContent value="simulation" className="mx-4 py-2 space-y-2 bg-[#081c4b] min-h-[80vh] border-t border-gray-600">
        Coming Soon
      </TabsContent>

    </Tabs>
  );
}