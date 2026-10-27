import type { ThroughputCardProps } from "./throughput-card.props";
import { ThroughputHorizontalCard } from "./throughput-horizontal-card";
import { ThroughputVerticalCard } from "./throughput-vertical-card";

export function ThroughputCard(props: ThroughputCardProps) {
  return props.orientation === "horizontal" ? (
    <ThroughputHorizontalCard {...props} />
  ) : (
    <ThroughputVerticalCard {...props} />
  );
}
