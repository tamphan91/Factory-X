import { LEAD_TIME_SLOT_COUNT } from "@/models/domain/lead-time";
import type { DemandSnapshot } from "@/models/types/demand";
import type { DemandForecast } from "@/models/types/demand-forecast";
import type { LeadTimeRange, LeadTimeSeries } from "@/models/types/lead-time";
import type { ProductDemandSnapshot } from "@/models/types/product-demand";

const createProductDemandMock = (): ProductDemandSnapshot => ({
  groupLabel: "DENSO Vietnam (OEM Products)",
  deltaPct: 10,
  products: [
    { id: "vic", name: "Vortex Creation Valve (VIC)", requests: 48, icon: "valve" },
    { id: "avs", name: "AVS Valve System", requests: 36, icon: "solenoid" },
    { id: "o2", name: "Oxygen Sensor (O2 Sensor)", requests: 42, icon: "sensor", priority: "high" },
    { id: "at-sol", name: "AT-SOL (Oil Pressure Control)", requests: 28, icon: "solenoid" },
    { id: "cvt", name: "CVT Control Valve", requests: 24, icon: "valve" },
    { id: "dct", name: "DCT Control Valve", requests: 18, icon: "valve" },
    { id: "egrv", name: "EGRV (Exhaust Gas Recirculation)", requests: 20, icon: "egr" },
    { id: "ls-egr", name: "LS-EGR (Linear Solenoid EGR)", requests: 16, icon: "solenoid", priority: "mid" },
    { id: "ocv", name: "OCV (Oil Control Valve)", requests: 26, icon: "valve" },
    { id: "vct-rotor", name: "VCT Rotor", requests: 30, icon: "gear" },
    { id: "vct-housing", name: "VCT Housing", requests: 22, icon: "housing" },
    { id: "i-vlv", name: "I-VLV (Intake Valve)", requests: 20, icon: "valve" },
  ],
});

/** Today as yyyy-mm-dd in local time. */
const todayIso = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

// Demand only: the capacity lines come from the Overview snapshot.
const createForecastMock = (): DemandForecast => ({
  startDate: todayIso(),
  actualDays: 3,
  days: [560, 520, 545, 600, 575, 590, 550, 610, 580, 620, 640, 600, 630, 650].map(
    (demand) => ({ demand }),
  ),
});

// Same length as the Overview trend, so every line ends its actual part at the same slot.
const ACTUAL_SLOTS = 18;
const FORECAST_SLOTS = LEAD_TIME_SLOT_COUNT - ACTUAL_SLOTS;
const WOBBLE = [0, 1, -1, 2, 0, -2, 1];

/** Deterministic demo values moving from `from` to `to`. */
const ramp = (from: number, to: number, count: number, shift = 0): number[] =>
  Array.from({ length: count }, (_, index) =>
    Math.round(
      from +
        ((to - from) * index) / Math.max(1, count - 1) +
        WOBBLE[(index + shift) % WOBBLE.length],
    ),
  );

type Trajectory = { from: number; to: number; shift: number };

/** A series that owns its actual points; `ahead` continues it into the forecast. */
const ownSeries = (
  head: Pick<LeadTimeSeries, "process" | "label">,
  actual: Trajectory,
  ahead: Trajectory,
): LeadTimeSeries => ({
  ...head,
  actual: ramp(actual.from, actual.to, ACTUAL_SLOTS, actual.shift),
  forecast: ramp(ahead.from, ahead.to, FORECAST_SLOTS, ahead.shift),
});

/** A series whose actual points are owned by another snapshot; only the forecast is stored. */
const forecastOnly = (
  head: Pick<LeadTimeSeries, "process" | "label">,
  ahead: Trajectory,
): LeadTimeSeries => ({
  ...head,
  forecast: ramp(ahead.from, ahead.to, FORECAST_SLOTS, ahead.shift),
});

const RECEIVING = { process: "inbound", label: "Receiving" } as const;
const PUTAWAY = { process: "putaway", label: "Put-away" } as const;
const PICKING = { process: "picking", label: "Picking / Kitting" } as const;
const STAGING = { process: "delivery", label: "Staging" } as const;

const createLeadTimeMock = (): Record<LeadTimeRange, LeadTimeSeries[]> => ({
  // Receiving and Picking actual points come from the Overview snapshot.
  today: [
    forecastOnly(RECEIVING, { from: 57, to: 61, shift: 1 }),
    ownSeries(PUTAWAY, { from: 19, to: 29, shift: 0 }, { from: 30, to: 33, shift: 2 }),
    forecastOnly(PICKING, { from: 30, to: 35, shift: 3 }),
    ownSeries(STAGING, { from: 30, to: 50, shift: 4 }, { from: 52, to: 59, shift: 5 }),
  ],
  yesterday: [
    ownSeries(RECEIVING, { from: 30, to: 52, shift: 1 }, { from: 53, to: 56, shift: 2 }),
    ownSeries(PUTAWAY, { from: 17, to: 27, shift: 3 }, { from: 28, to: 30, shift: 4 }),
    ownSeries(PICKING, { from: 16, to: 26, shift: 5 }, { from: 27, to: 30, shift: 6 }),
    ownSeries(STAGING, { from: 28, to: 46, shift: 0 }, { from: 47, to: 52, shift: 1 }),
  ],
  week: [
    ownSeries(RECEIVING, { from: 34, to: 55, shift: 2 }, { from: 56, to: 60, shift: 3 }),
    ownSeries(PUTAWAY, { from: 20, to: 30, shift: 4 }, { from: 31, to: 34, shift: 5 }),
    ownSeries(PICKING, { from: 20, to: 31, shift: 6 }, { from: 32, to: 36, shift: 0 }),
    ownSeries(STAGING, { from: 32, to: 52, shift: 1 }, { from: 53, to: 60, shift: 2 }),
  ],
});

export const createDemandMock = (): DemandSnapshot => ({
  productDemand: createProductDemandMock(),
  forecast: createForecastMock(),
  leadTime: createLeadTimeMock(),
  updatedAt: new Date().toISOString(),
});
