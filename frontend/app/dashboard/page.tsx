import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardFooter } from "@/components/footer/dashboard-footer";
import { DashboardHeader } from "@/components/header/dashboard-header";
import { DashboardTabs } from "@/components/tabs/dashboard-tabs";
export const instant = false;

export default async function Page() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen">
            <DashboardHeader />
            <DashboardTabs />
            <DashboardFooter />
        </div>
    );
}