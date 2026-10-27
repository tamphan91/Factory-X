import { create } from "zustand";
import type { DemandSort } from "@/models/domain/product-demand";
import type { AlertSeverity } from "@/models/types/alert";
import type { ForecastRange } from "@/models/types/demand-forecast";
import type { LeadTimeRange } from "@/models/types/lead-time";

type UiState = {
  alertFilter: AlertSeverity | "all";
  throughputMode: "actual" | "target";
  demandSort: DemandSort;
  forecastRange: ForecastRange;
  leadTimeRange: LeadTimeRange;
};

type UiActions = {
  setAlertFilter: (filter: UiState["alertFilter"]) => void;
  setThroughputMode: (mode: UiState["throughputMode"]) => void;
  setDemandSort: (sort: DemandSort) => void;
  setForecastRange: (range: ForecastRange) => void;
  setLeadTimeRange: (range: LeadTimeRange) => void;
};

export const useUiStore = create<UiState & UiActions>((set) => ({
  alertFilter: "all",
  throughputMode: "actual",
  demandSort: "order",
  forecastRange: "7",
  leadTimeRange: "today",
  setAlertFilter: (alertFilter) => set({ alertFilter }),
  setThroughputMode: (throughputMode) => set({ throughputMode }),
  setDemandSort: (demandSort) => set({ demandSort }),
  setForecastRange: (forecastRange) => set({ forecastRange }),
  setLeadTimeRange: (leadTimeRange) => set({ leadTimeRange }),
}));
