import { Card } from "@/views/common/ui/card";
import type { KpiCardShellProps } from "./kpi-card-shell.props";

export function KpiCardShell({ title, children }: KpiCardShellProps) {
  return (
    <Card className="h-[150px] justify-between gap-2 rounded-xl border bg-white p-2 shadow-sm">
      {title && <h3 className="font-extrabold">{title}</h3>}
      {children}
    </Card>
  );
}
