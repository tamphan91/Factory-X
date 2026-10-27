"use client";

import { FilterSelect } from "@/views/common/filter-select";
import { PanelCard } from "@/views/common/panel-card";
import { DemandTotal } from "./demand-total";
import { ProductDemandRow } from "./product-demand-row";
import type { ProductDemandPanelProps } from "./product-demand-panel.props";

export function ProductDemandPanel({
  groupLabel,
  periodLabel,
  rows,
  total,
  sort,
  sortOptions,
  onSortChange,
}: ProductDemandPanelProps) {
  return (
    <PanelCard
      title="Production Demand"
      subtitle="(Material Requests)"
      className="h-full"
      actions={
        <FilterSelect
          label="Sort products"
          options={sortOptions}
          value={sort}
          onChange={onSortChange}
          widthClass="w-[160px]"
        />
      }
    >
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-fx-primary">Product Groups – {groupLabel}</span>
        <small className="text-fx-muted">{periodLabel}</small>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-md border py-8 text-center text-sm text-fx-muted">
          No material requests.
        </p>
      ) : (
        <ul className="min-h-[420px] flex-1 rounded-md border px-2">
          {rows.map(({ id, ...row }) => (
            <ProductDemandRow key={id} {...row} />
          ))}
        </ul>
      )}

      <DemandTotal {...total} />
    </PanelCard>
  );
}
