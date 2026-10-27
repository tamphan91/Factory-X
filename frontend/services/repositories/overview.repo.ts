import type { OverviewSnapshot } from "@/models/types/overview";
import { createOverviewMock } from "@/services/mock/overview.mock";

export interface OverviewRepo {
  getOverview: () => Promise<OverviewSnapshot>;
}

const mockOverviewRepo: OverviewRepo = {
  getOverview: async () => createOverviewMock(),
};

// An HTTP repository is added behind this same interface (FE-design.md §4).
const selectRepo = (): OverviewRepo => {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "http") {
    throw new Error("The HTTP overview repository is not implemented yet.");
  }
  return mockOverviewRepo;
};

export const overviewRepo: OverviewRepo = selectRepo();
