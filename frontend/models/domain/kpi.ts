/** Whole-number percent of `current` in `total`. NaN when there is no total. */
export const percentOf = (current: number, total: number): number =>
  total > 0 ? Math.round((current / total) * 100) : Number.NaN;

/** "+2%", "-15%", "0%". "–" when the value is missing. */
export const formatDelta = (deltaPct: number | undefined): string => {
  if (deltaPct === undefined || Number.isNaN(deltaPct)) {
    return "–";
  }
  const sign = deltaPct > 0 ? "+" : "";
  return `${sign}${deltaPct}%`;
};

export const formatNumber = (value: number): string =>
  value.toLocaleString("en-US");
