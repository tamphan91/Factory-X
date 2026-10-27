import { formatDelta } from "@/models/domain/kpi";
import {
  productTone,
  signalLevel,
  sortProducts,
  totalRequests,
  type DemandSort,
} from "@/models/domain/product-demand";
import { deltaTone } from "@/models/domain/tone";
import type {
  ProductDemand,
  ProductDemandSnapshot,
  ProductPriority,
} from "@/models/types/product-demand";
import type { FilterOption } from "@/views/common/filter-select.props";
import type { ProductDemandRowVM } from "@/views/features/demand/product-demand-row.props";
import type { DemandVM } from "@/views/features/demand/demand-page.props";

const SORT_OPTIONS: FilterOption<DemandSort>[] = [
  { value: "order", label: "Original order" },
  { value: "desc", label: "Most requests" },
  { value: "asc", label: "Fewest requests" },
  { value: "name", label: "Name A–Z" },
];

const PRIORITY_LABEL: Record<ProductPriority | "normal", string> = {
  high: "High priority",
  mid: "Medium priority",
  normal: "Normal priority",
};

const buildRowVM = (product: ProductDemand, maxRequests: number): ProductDemandRowVM => ({
  id: product.id,
  name: product.name,
  requests: product.requests,
  icon: product.icon,
  signal: {
    level: signalLevel(product.requests, maxRequests),
    tone: productTone(product.priority),
    label: PRIORITY_LABEL[product.priority ?? "normal"],
  },
  title: `${product.name}: ${product.requests} requests today`,
});

export const buildProductDemandVM = (
  snapshot: ProductDemandSnapshot,
  sort: DemandSort,
): DemandVM["products"] => {
  const maxRequests = Math.max(0, ...snapshot.products.map((product) => product.requests));
  return {
    groupLabel: snapshot.groupLabel,
    periodLabel: "Today (req.)",
    rows: sortProducts(snapshot.products, sort).map((product) =>
      buildRowVM(product, maxRequests),
    ),
    total: {
      label: "Total Material Requests",
      total: totalRequests(snapshot.products),
      // More requests mean more load on the warehouse, so a rise is bad.
      delta: {
        text: formatDelta(snapshot.deltaPct),
        tone: deltaTone(snapshot.deltaPct, "down"),
      },
      caption: "(vs. yesterday)",
    },
    sort,
    sortOptions: SORT_OPTIONS,
  };
};
