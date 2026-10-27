import { DeltaIndicator } from "@/views/common/delta-indicator";
import type { DemandTotalProps } from "./demand-total.props";

export function DemandTotal({ label, total, delta, caption }: DemandTotalProps) {
  return (
    <div className="flex items-center justify-between border-t pt-3">
      <span className="font-bold text-blue-900">{label}</span>
      <b className="text-2xl text-fx-ink tabular-nums">{total}</b>
      <DeltaIndicator text={delta.text} tone={delta.tone} caption={caption} />
    </div>
  );
}
