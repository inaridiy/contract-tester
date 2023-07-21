import { create } from "zustand";

import { ContractData } from "@/types/contract-data";

export interface ContractStoreState {
  contracts: Record<string, ContractData>;
}

export interface ContractStoreActions {
  setContract: (contract: ContractData) => void;
}

export const useContractStore = create<ContractStoreState & ContractStoreActions>((set) => ({
  contracts: {},
  setContract: (contract) =>
    set((state) => ({ contracts: { ...state.contracts, [contract.name]: contract } })),
}));
