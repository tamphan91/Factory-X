import { Icon } from "@/views/common/icon";
import { SignalBars } from "@/views/common/signal-bars";
import type { ProductDemandRowProps } from "./product-demand-row.props";

export function ProductDemandRow({
  name,
  requests,
  icon,
  signal,
  title,
}: ProductDemandRowProps) {
  return (
    <li
      title={title}
      className="flex items-center gap-3 border-b border-slate-100 py-2.5 last:border-b-0"
    >
      <Icon name={icon} size={24} className="text-fx-ink" />
      <span className="flex-1 text-fx-ink">{name}</span>
      <b className="text-fx-ink tabular-nums">{requests}</b>
      <SignalBars {...signal} />
    </li>
  );
}
