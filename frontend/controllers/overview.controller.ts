import { useEffect, useMemo, useState } from "react";
import { useUiStore } from "@/models/stores/ui-store";
import type { OverviewSnapshot } from "@/models/types/overview";
import { overviewRepo } from "@/services/repositories/overview.repo";
import type {
  OverviewActions,
  OverviewVM,
} from "@/views/features/overview/overview-page.props";
import {
  buildAlertsVM,
  buildLeadTimeVM,
  buildStagingVM,
  buildSupplyRateVM,
  buildThroughputAxisMax,
  buildThroughputItemsVM,
  buildWarehouseVM,
} from "./overview.vm";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; snapshot: OverviewSnapshot };

export type OverviewController =
  | { status: "loading" | "error"; vm: undefined; actions: OverviewActions }
  | { status: "ready"; vm: OverviewVM; actions: OverviewActions };

export function useOverviewController(): OverviewController {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const alertFilter = useUiStore((s) => s.alertFilter);
  const throughputMode = useUiStore((s) => s.throughputMode);
  const setAlertFilter = useUiStore((s) => s.setAlertFilter);
  const setThroughputMode = useUiStore((s) => s.setThroughputMode);

  useEffect(() => {
    let cancelled = false;
    overviewRepo
      .getOverview()
      .then((snapshot) => {
        if (!cancelled) setState({ status: "ready", snapshot });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const actions = useMemo<OverviewActions>(
    () => ({
      onThroughputModeChange: setThroughputMode,
      onAlertFilterChange: setAlertFilter,
      onViewAllAlerts: () => setAlertFilter("all"),
    }),
    [setAlertFilter, setThroughputMode],
  );

  const snapshot = state.status === "ready" ? state.snapshot : undefined;

  const vm = useMemo<OverviewVM | undefined>(() => {
    if (!snapshot) {
      return undefined;
    }
    return {
      supply: buildSupplyRateVM(snapshot),
      inbound: buildLeadTimeVM("Inbound Lead Time", snapshot.inbound),
      picking: buildLeadTimeVM("Picking / Kitting Lead Time", snapshot.picking),
      staging: buildStagingVM(snapshot),
      warehouse: buildWarehouseVM(snapshot),
      throughput: {
        items: buildThroughputItemsVM(snapshot.throughput),
        mode: throughputMode,
        axisMax: buildThroughputAxisMax(snapshot.throughput, throughputMode),
      },
      alerts: {
        ...buildAlertsVM(snapshot.alerts, alertFilter),
        filter: alertFilter,
      },
    };
  }, [snapshot, alertFilter, throughputMode]);

  return vm
    ? { status: "ready", vm, actions }
    : { status: state.status === "error" ? "error" : "loading", vm: undefined, actions };
}
