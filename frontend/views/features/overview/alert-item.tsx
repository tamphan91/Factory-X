import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cva } from "class-variance-authority";
import type { AlertItemProps } from "./alert-item.props";

const rowVariants = cva("flex items-center rounded-md border-l-4 p-2", {
  variants: {
    severity: {
      critical: "border-fx-danger bg-red-50",
      warning: "border-fx-caution bg-yellow-50",
      info: "border-fx-info bg-blue-50",
    },
  },
});

const badgeVariants = cva("flex h-9 w-9 items-center justify-center rounded-full", {
  variants: {
    severity: {
      critical: "bg-fx-danger text-white",
      warning: "bg-fx-caution text-black",
      info: "bg-fx-info text-white",
    },
  },
});

const ICONS = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

export function AlertItem({ severity, title, detail, time }: AlertItemProps) {
  const Icon = ICONS[severity];

  return (
    <div className={rowVariants({ severity })}>
      <div className={badgeVariants({ severity })}>
        <Icon size={18} aria-label={severity} />
      </div>

      <div className="ml-3 flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>

      <div className="text-xs text-slate-500">{time}</div>
    </div>
  );
}
