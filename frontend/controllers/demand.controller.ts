import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "@/models/stores/ui-store";
import type { DemandSnapshot } from "@/models/types/demand";
import type { OverviewSnapshot } from "@/models/types/overview";
import { demandRepo } from "@/services/repositories/demand.repo";
import { overviewRepo } from "@/services/repositories/overview.repo";
import type {
  DemandActions,
  DemandVM,
} from "@/views/features/demand/demand-page.props";
import {
  buildForecastVM,
  buildLeadTimeTrendVM,
  buildProductDemandVM,
} from "./demand.vm";

type Snapshots = { overview: OverviewSnapshot; demand: DemandSnapshot };

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; snapshots: Snapshots };

export type DemandController =
  | { status: "loading" | "error"; vm: undefined; actions: DemandActions }
  | { status: "ready"; vm: DemandVM; actions: DemandActions };

export function useDemandController(): DemandController {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const demandSort = useUiStore((s) => s.demandSort);
  const forecastRange = useUiStore((s) => s.forecastRange);
  const leadTimeRange = useUiStore((s) => s.leadTimeRange);
  const setDemandSort = useUiStore((s) => s.setDemandSort);
  const setForecastRange = useUiStore((s) => s.setForecastRange);
  const setLeadTimeRange = useUiStore((s) => s.setLeadTimeRange);

  useEffect(() => {
    let cancelled = false;
    // The Overview snapshot is the source of the shared lead-time and capacity figures.
    Promise.all([overviewRepo.getOverview(), demandRepo.getDemand()])
      .then(([overview, demand]) => {
        if (!cancelled) setState({ status: "ready", snapshots: { overview, demand } });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const actions = useMemo<DemandActions>(
    () => ({
      onSortChange: setDemandSort,
      onForecastRangeChange: setForecastRange,
      onLeadTimeRangeChange: setLeadTimeRange,
    }),
    [setDemandSort, setForecastRange, setLeadTimeRange],
  );

  const snapshots = state.status === "ready" ? state.snapshots : undefined;

  const vm = useMemo<DemandVM | undefined>(() => {
    if (!snapshots) {
      return undefined;
    }
    const { overview, demand } = snapshots;
    return {
      products: buildProductDemandVM(demand.productDemand, demandSort),
      forecast: buildForecastVM(overview, demand.forecast, forecastRange),
      leadTime: buildLeadTimeTrendVM(overview, demand.leadTime, leadTimeRange),
    };
  }, [snapshots, demandSort, forecastRange, leadTimeRange]);

  return vm
    ? { status: "ready", vm, actions }
    : { status: state.status === "error" ? "error" : "loading", vm: undefined, actions };
}
