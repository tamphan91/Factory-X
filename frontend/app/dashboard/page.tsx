import { DashboardFooter } from "@/components/footer/dashboard-footer";
import { DashboardHeader } from "@/components/header/dashboard-header";
import { DashboardTabs } from "@/components/tabs/dashboard-tabs";

export default function Page() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <DashboardTabs />
      <DashboardFooter />
    </div>
  );
}