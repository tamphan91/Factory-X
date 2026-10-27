import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Boxes,
  Building2,
  Factory,
  Info,
  Package,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ProductIconName } from "@/models/types/product-demand";
import type { IconName, IconProps, UiIconName } from "./icon.props";

// The only file that holds SVG assets and imports an icon library.
// Features render <Icon name="..." />.

/** Hand-drawn product icons from the prototype; they draw with the current text colour. */
const PRODUCT_ICONS: Record<ProductIconName, ReactNode> = {
  valve: (
    <>
      <rect x="3" y="9" width="11" height="7" rx="1.5" />
      <path d="M14 10.5h4v4h-4M18 11.5h3v2h-3M6.5 9V5h4v4M5.5 5h6" />
    </>
  ),
  solenoid: (
    <>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M6.5 7v10M9 7v10M11.5 7v10M15 10h4v4h-4M19 11h2.5v2H19" />
    </>
  ),
  sensor: (
    <path d="M2 12h5M7 8.5h5v7H7zM12 10h3v4h-3M15 10.8h4l2 1.2-2 1.2h-4M9 8.5v7M10.5 8.5v7" />
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  housing: (
    <>
      <path d="M4 8l8-4 8 4v8l-8 4-8-4z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M4 8l8 4 8-4" />
    </>
  ),
  egr: (
    <>
      <rect x="3" y="9" width="9" height="7" rx="1.5" />
      <path d="M12 11h3v3h-3M15 8.5h6v8h-6zM5.5 9V5h4v4" />
    </>
  ),
};

const UI_ICONS: Record<UiIconName, LucideIcon> = {
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  info: Info,
  truck: Truck,
  "arrow-right": ArrowRight,
  "arrow-down": ArrowDown,
  boxes: Boxes,
  building: Building2,
  factory: Factory,
  package: Package,
  warehouse: Warehouse,
};

const isProductIcon = (name: IconName): name is ProductIconName =>
  name in PRODUCT_ICONS;

export function Icon({ name, size = 24, className }: IconProps) {
  if (isProductIcon(name)) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn("shrink-0", className)}
      >
        {PRODUCT_ICONS[name]}
      </svg>
    );
  }

  const UiIcon = UI_ICONS[name];
  return <UiIcon size={size} aria-hidden="true" className={className} />;
}
