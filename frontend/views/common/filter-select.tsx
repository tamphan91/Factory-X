"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FilterSelectProps } from "./filter-select.props";

export function FilterSelect<V extends string = string>({
  options,
  value,
  onChange,
  label,
  widthClass = "w-[140px]",
}: FilterSelectProps<V>) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        if (next !== null) {
          onChange(next as V);
        }
      }}
    >
      <SelectTrigger aria-label={label} className={cn(widthClass)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
