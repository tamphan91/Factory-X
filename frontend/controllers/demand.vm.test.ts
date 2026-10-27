import { describe, expect, it } from "vitest";
import { createDemandMock } from "@/services/mock/demand.mock";
import { createOverviewMock } from "@/services/mock/overview.mock";
import { buildForecastVM, buildProductDemandVM } from "./demand.vm";

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

describe("buildForecastVM", () => {
  const { forecast } = createDemandMock();

  it("shows 7 or 14 days with matching series", () => {
    const week = buildForecastVM(createOverviewMock(), forecast, "7");
    const fortnight = buildForecastVM(createOverviewMock(), forecast, "14");
    expect(week.labels).toHaveLength(7);
    expect(week.demand).toHaveLength(7);
    expect(week.warehouseCapacity).toHaveLength(7);
    expect(fortnight.labels).toHaveLength(14);
    expect(fortnight.stagingCapacity).toHaveLength(14);
  });

  it("draws the capacity lines from the Overview totals", () => {
    const vm = buildForecastVM(createOverviewMock(), forecast, "7");
    expect(vm.warehouseCapacity[0]).toBe(950);
    expect(vm.stagingCapacity[0]).toBe(850);
  });

  it("changes the capacity lines when the Overview totals change", () => {
    const overview = createOverviewMock();
    overview.warehouse.total = 20000;
    const vm = buildForecastVM(overview, forecast, "7");
    expect(vm.warehouseCapacity[0]).toBe(1900);
    expect(vm.axisMax).toBe(2000);
  });

  it("fits the axis on 400-pallet steps", () => {
    const vm = buildForecastVM(createOverviewMock(), forecast, "7");
    expect(vm.axisMax).toBe(1200);
    expect(vm.axisInterval).toBe(400);
  });
});
