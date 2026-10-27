import type { ProductIconName } from "@/models/types/product-demand";

/** Icons of the interface; the registry maps each to a `lucide-react` icon. */
export type UiIconName =
  | "alert-circle"
  | "alert-triangle"
  | "info"
  | "truck"
  | "arrow-right"
  | "arrow-down"
  | "boxes"
  | "building"
  | "factory"
  | "package"
  | "warehouse";

export type IconName = ProductIconName | UiIconName;

export interface IconProps {
  name: IconName;
  /** Pixels. Default 24. */
  size?: number;
  className?: string;
}
