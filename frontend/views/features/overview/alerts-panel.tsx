"use client";

import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/views/common/filter-select";
import type { FilterOption } from "@/views/common/filter-select.props";
import { PanelCard } from "@/views/common/panel-card";
import { AlertItem } from "./alert-item";
import type { AlertFilter, AlertsPanelProps } from "./alerts-panel.props";

const FILTER_OPTIONS: FilterOption<AlertFilter>[] = [
  { value: "all", label: "All Alerts" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
];

export function AlertsPanel({
  items,
  total,
  filter,
  onFilterChange,
  onViewAll,
}: AlertsPanelProps) {
  return (
    <PanelCard
      title={`Active Alerts (${total})`}
      className="h-[480px]"
      actions={
        <div className="flex items-center gap-2">
          {filter !== "all" && (
            <Button variant="link" size="sm" onClick={onViewAll}>
              View All ›
            </Button>
          )}
          <FilterSelect
            label="Alert level"
            options={FILTER_OPTIONS}
            value={filter}
            onChange={onFilterChange}
          />
        </div>
      }
    >
      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No alerts at this level
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto">
          {items.map(({ id, ...alert }) => (
            <AlertItem key={id} {...alert} />
          ))}
        </div>
      )}
    </PanelCard>
  );
}
