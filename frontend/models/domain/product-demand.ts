import type { Tone } from "@/models/domain/tone";
import type {
  ProductDemand,
  ProductPriority,
} from "@/models/types/product-demand";

export type DemandSort = "order" | "desc" | "asc" | "name";

/** A sorted copy; "order" keeps the original order. */
export const sortProducts = (
  products: ProductDemand[],
  sort: DemandSort,
): ProductDemand[] => {
  switch (sort) {
    case "desc":
      return [...products].sort((a, b) => b.requests - a.requests);
    case "asc":
      return [...products].sort((a, b) => a.requests - b.requests);
    case "name":
      return [...products].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return [...products];
  }
};

export const totalRequests = (products: ProductDemand[]): number =>
  products.reduce((sum, product) => sum + product.requests, 0);

export const SIGNAL_LEVELS = 4;

/** Lit bars (1 to 4) of a request count against the largest count in the list. */
export const signalLevel = (requests: number, maxRequests: number): number => {
  if (maxRequests <= 0) {
    return 1;
  }
  const level = Math.round((requests / maxRequests) * SIGNAL_LEVELS);
  return Math.max(1, Math.min(SIGNAL_LEVELS, level));
};

/** Colour of the signal bars. Priority comes from the data, so it does not follow the count. */
export const productTone = (priority: ProductPriority | undefined): Tone => {
  switch (priority) {
    case "high":
      return "critical";
    case "mid":
      return "warning";
    default:
      return "neutral";
  }
};
