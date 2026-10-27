import type { DemandSnapshot } from "@/models/types/demand";
import { createDemandMock } from "@/services/mock/demand.mock";

export interface DemandRepo {
  getDemand: () => Promise<DemandSnapshot>;
}

const mockDemandRepo: DemandRepo = {
  getDemand: async () => createDemandMock(),
};

// An HTTP repository is added behind this same interface (FE-design.md §4).
const selectRepo = (): DemandRepo => {
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "http") {
    throw new Error("The HTTP demand repository is not implemented yet.");
  }
  return mockDemandRepo;
};

export const demandRepo: DemandRepo = selectRepo();
