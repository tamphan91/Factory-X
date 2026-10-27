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

export { createProductDemandMock };
