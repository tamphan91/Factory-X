import { create } from "zustand";
import type { AlertSeverity } from "@/models/types/alert";

type UiState = {
  alertFilter: AlertSeverity | "all";
  throughputMode: "actual" | "target";
};

type UiActions = {
  setAlertFilter: (filter: UiState["alertFilter"]) => void;
  setThroughputMode: (mode: UiState["throughputMode"]) => void;
};

export const useUiStore = create<UiState & UiActions>((set) => ({
  alertFilter: "all",
  throughputMode: "actual",
  setAlertFilter: (alertFilter) => set({ alertFilter }),
  setThroughputMode: (throughputMode) => set({ throughputMode }),
}));
