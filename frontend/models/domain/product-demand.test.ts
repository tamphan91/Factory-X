import { describe, expect, it } from "vitest";
import type { ProductDemand } from "@/models/types/product-demand";
import { sortProducts, totalRequests } from "./product-demand";

const product = (name: string, requests: number): ProductDemand => ({
  id: name,
  name,
  requests,
  icon: "valve",
});

const products = [product("Bravo", 20), product("Alpha", 48), product("Charlie", 16)];
const namesOf = (list: ProductDemand[]): string[] => list.map((item) => item.name);

describe("sortProducts", () => {
  it("keeps the original order", () => {
    expect(namesOf(sortProducts(products, "order"))).toEqual(["Bravo", "Alpha", "Charlie"]);
  });

  it("sorts by most and fewest requests", () => {
    expect(namesOf(sortProducts(products, "desc"))).toEqual(["Alpha", "Bravo", "Charlie"]);
    expect(namesOf(sortProducts(products, "asc"))).toEqual(["Charlie", "Bravo", "Alpha"]);
  });

  it("sorts by name", () => {
    expect(namesOf(sortProducts(products, "name"))).toEqual(["Alpha", "Bravo", "Charlie"]);
  });

  it("does not change its input", () => {
    sortProducts(products, "desc");
    expect(namesOf(products)).toEqual(["Bravo", "Alpha", "Charlie"]);
  });
});

describe("totalRequests", () => {
  it("adds the requests of every product", () => {
    expect(totalRequests(products)).toBe(84);
  });

  it("is 0 for an empty list", () => {
    expect(totalRequests([])).toBe(0);
  });
});
