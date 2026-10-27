import { Card } from "@/views/common/ui/card";
import { cn } from "@/lib/utils";
import type { PanelCardProps } from "./panel-card.props";

export function PanelCard({
  title,
  subtitle,
  actions,
  className,
  children,
}: PanelCardProps) {
  return (
    <Card className={cn("gap-2 rounded-xl border bg-white p-3 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold">
          {title}
          {subtitle && (
            <span className="ml-1 text-xs font-normal text-fx-muted">{subtitle}</span>
          )}
        </h3>
        {actions}
      </div>
      {children}
    </Card>
  );
}
