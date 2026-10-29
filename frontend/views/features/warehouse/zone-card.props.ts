export interface ZoneCardProps {
  name: string;
  occupancy: number;
  color: string;
  vehicle?: string;
  alert?: boolean;
  className?: string;
  isUtilization?: boolean;
}
