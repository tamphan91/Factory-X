import { describe, expect, it } from "vitest";
import { createDemandMock } from "@/services/mock/demand.mock";
import { buildProductDemandVM } from "./demand.vm";

describe("buildProductDemandVM", () => {
  const { productDemand } = createDemandMock();

  it("totals the requests of the rows", () => {
    expect(buildProductDemandVM(productDemand, "order").total.total).toBe(330);
  });

  it("shows a rise in requests as bad", () => {
    const { delta } = buildProductDemandVM(productDemand, "order").total;
    expect(delta).toEqual({ text: "+10%", tone: "bad" });
  });

  it("keeps the original order or sorts by requests", () => {
    const original = buildProductDemandVM(productDemand, "order").rows;
    const most = buildProductDemandVM(productDemand, "desc").rows;
    expect(original[0].requests).toBe(48);
    expect(original[1].requests).toBe(36);
    expect(most.map((row) => row.requests).slice(0, 3)).toEqual([48, 42, 36]);
  });

  it("takes the signal tone from the priority and the level from the count", () => {
    const rows = buildProductDemandVM(productDemand, "order").rows;
    const byId = (id: string) => rows.find((row) => row.id === id)!;
    expect(byId("o2").signal).toEqual({ level: 4, tone: "critical", label: "High priority" });
    expect(byId("ls-egr").signal).toMatchObject({ level: 1, tone: "warning" });
    expect(byId("vic").signal).toMatchObject({ level: 4, tone: "neutral" });
  });
});
