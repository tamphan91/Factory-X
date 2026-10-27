import type { LeadTimeLine, LeadTimeRange } from "@/models/types/lead-time";
import type { FilterOption } from "@/views/common/filter-select.props";

/** What the chart draws. */
export interface LeadTimeChartData {
  /** "08:00" ... "22:00" */
  labels: string[];
  /** One line per process; colour comes from the process. */
  lines: LeadTimeLine[];
  /** Slot where the forecast region starts; computed by `forecastStartIndex`. */
  forecastStart: number;
}

export interface LeadTimeTrendChartProps extends LeadTimeChartData {
  range: LeadTimeRange;
  rangeOptions: FilterOption<LeadTimeRange>[];
  onRangeChange: (range: LeadTimeRange) => void;
}
