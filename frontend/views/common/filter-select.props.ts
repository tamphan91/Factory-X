export interface FilterOption<V extends string = string> {
  value: V;
  label: string;
}

export interface FilterSelectProps<V extends string = string> {
  options: FilterOption<V>[];
  value: V;
  onChange: (value: V) => void;
  /** Accessible name of the dropdown. */
  label?: string;
  /** Tailwind width class. Default "w-[140px]". */
  widthClass?: string;
}
