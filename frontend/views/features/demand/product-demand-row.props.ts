import type { SignalBarsProps } from "@/views/common/signal-bars.props";
import type { ProductIconName } from "@/models/types/product-demand";

export interface ProductDemandRowProps {
  /** "Vortex Creation Valve (VIC)" */
  name: string;
  requests: number;
  icon: ProductIconName;
  /** Level, tone and label are computed in the controller. */
  signal: SignalBarsProps;
  /** Tooltip of the row, such as "AVS Valve System: 36 requests today". */
  title: string;
}

/** A row in a list needs a key. */
export type ProductDemandRowVM = ProductDemandRowProps & { id: string };
