import type { DemandSort } from "@/models/domain/product-demand";
import type { FilterOption } from "@/views/common/filter-select.props";
import type { DemandTotalProps } from "./demand-total.props";
import type { ProductDemandRowVM } from "./product-demand-row.props";

export interface ProductDemandPanelProps {
  /** "DENSO Vietnam (OEM Products)" */
  groupLabel: string;
  /** "Today (req.)" */
  periodLabel: string;
  /** Already sorted by the controller. */
  rows: ProductDemandRowVM[];
  total: DemandTotalProps;
  sort: DemandSort;
  sortOptions: FilterOption<DemandSort>[];
  onSortChange: (sort: DemandSort) => void;
}
