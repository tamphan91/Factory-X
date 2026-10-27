import type { ForecastRange } from "@/models/types/demand-forecast";
import type { FilterOption } from "@/views/common/filter-select.props";

/** What the chart draws. All arrays have one value per day. */
export interface ForecastChartData {
  /** "10/27" */
  labels: string[];
  /** Pallets per day. */
  demand: number[];
  warehouseCapacity: number[];
  stagingCapacity: number[];
  /** Computed by `forecastAxisMax`. */
  axisMax: number;
  /** Distance between y-axis ticks; `FORECAST_AXIS_STEP`. */
  axisInterval: number;
  /** Days before the forecast region starts. */
  actualDays: number;
}

export interface DemandForecastChartProps extends ForecastChartData {
  range: ForecastRange;
  rangeOptions: FilterOption<ForecastRange>[];
  onRangeChange: (range: ForecastRange) => void;
}
