import type { ProductDemand } from "@/models/types/product-demand";

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
