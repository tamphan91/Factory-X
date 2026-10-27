import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardFooter } from "@/components/footer/dashboard-footer";
import { DashboardHeader } from "@/views/features/shell/dashboard-header";
import { DashboardTabs } from "@/views/features/shell/dashboard-tabs";
import { WarehouseOperationsPage } from "@/views/features/warehouse/warehouse-operations-page";
import { OverviewSection } from "./overview-section";
export const instant = false;

export default async function Page() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen">
            <DashboardHeader />
            <DashboardTabs
                overview={<OverviewSection />}
                warehouse={<WarehouseOperationsPage />}
            />
            <DashboardFooter />
        </div>
    );
}