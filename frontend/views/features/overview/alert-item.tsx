import { cva } from "class-variance-authority";
import { Icon } from "@/views/common/icon";
import type { IconName } from "@/views/common/icon.props";
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

const ICONS: Record<AlertItemProps["severity"], IconName> = {
  critical: "alert-circle",
  warning: "alert-triangle",
  info: "info",
};

export function AlertItem({ severity, title, detail, time }: AlertItemProps) {
  return (
    <div className={rowVariants({ severity })}>
      <div className={badgeVariants({ severity })} role="img" aria-label={severity}>
        <Icon name={ICONS[severity]} size={18} />
      </div>

      <div className="ml-3 flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>

      <div className="text-xs text-slate-500">{time}</div>
    </div>
  );
}
