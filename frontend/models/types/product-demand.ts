export type ProductIconName =
  | "valve"
  | "solenoid"
  | "sensor"
  | "gear"
  | "housing"
  | "egr";

/** Set by the data, not derived from the request count. */
export type ProductPriority = "high" | "mid";

export type ProductDemand = {
  id: string;
  /** "Vortex Creation Valve (VIC)" */
  name: string;
  /** Material requests today. */
  requests: number;
  icon: ProductIconName;
  priority?: ProductPriority;
};

/** The total is computed from `products`, never stored. */
export type ProductDemandSnapshot = {
  /** "DENSO Vietnam (OEM Products)" */
  groupLabel: string;
  products: ProductDemand[];
  /** Change of the total versus yesterday, in percent. */
  deltaPct: number;
};
