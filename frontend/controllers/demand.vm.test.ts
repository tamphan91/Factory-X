import { describe, expect, it } from "vitest";
import type { LeadTimeLine } from "@/models/types/lead-time";
import { createDemandMock } from "@/services/mock/demand.mock";
import { createOverviewMock } from "@/services/mock/overview.mock";
import {
  buildForecastVM,
  buildLeadTimeTrendVM,
  buildProductDemandVM,
} from "./demand.vm";

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

describe("buildLeadTimeTrendVM", () => {
  const { leadTime } = createDemandMock();
  const actualOf = (lines: LeadTimeLine[], process: LeadTimeLine["process"]) => {
    const line = lines.find((item) => item.process === process)!;
    return line.actual.slice(0, line.actualCount);
  };

  it("draws one line per process on the half-hour grid", () => {
    const vm = buildLeadTimeTrendVM(createOverviewMock(), leadTime, "today");
    expect(vm.lines.map((line) => line.label)).toEqual([
      "Receiving",
      "Put-away",
      "Picking / Kitting",
      "Staging",
    ]);
    expect(vm.labels[0]).toBe("08:00");
    expect(vm.labels).toHaveLength(29);
  });

  it("takes the Receiving and Picking actual points from the Overview", () => {
    const overview = createOverviewMock();
    const vm = buildLeadTimeTrendVM(overview, leadTime, "today");
    expect(actualOf(vm.lines, "inbound")).toEqual(overview.inbound.trend);
    expect(actualOf(vm.lines, "picking")).toEqual(overview.picking.trend);
  });

  it("follows a change in the Overview trends", () => {
    const overview = createOverviewMock();
    overview.inbound.trend = [10, 11, 12];
    overview.picking.trend = [5, 6];
    const vm = buildLeadTimeTrendVM(overview, leadTime, "today");
    expect(actualOf(vm.lines, "inbound")).toEqual([10, 11, 12]);
    expect(actualOf(vm.lines, "picking")).toEqual([5, 6]);
  });

  it("keeps Put-away and Staging on their own data", () => {
    const vm = buildLeadTimeTrendVM(createOverviewMock(), leadTime, "today");
    expect(actualOf(vm.lines, "putaway")).toEqual(leadTime.today[1].actual);
  });

  it("starts the forecast where the longest actual line ends", () => {
    const overview = createOverviewMock();
    const vm = buildLeadTimeTrendVM(overview, leadTime, "today");
    expect(vm.forecastStart).toBe(overview.inbound.trend.length - 1);
  });

  it("uses its own data for other ranges", () => {
    const overview = createOverviewMock();
    overview.inbound.trend = [10, 11, 12];
    const vm = buildLeadTimeTrendVM(overview, leadTime, "week");
    expect(actualOf(vm.lines, "inbound")).toEqual(leadTime.week[0].actual);
  });
});
