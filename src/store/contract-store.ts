import { create } from "zustand";

import { ContractData } from "@/types/contract-data";

export interface ContractStoreState {
  contracts: Record<string, ContractData>;
  selectedContract: string | null;
}

export interface ContractStoreActions {
  setContract: (contract: ContractData) => void;
  setSelectedContract: (contractName: string) => void;
}

export const useContractStore = create<ContractStoreState & ContractStoreActions>((set) => ({
  contracts: {},
  selectedContract: null,
  setSelectedContract: (contractName) => set({ selectedContract: contractName }),
  setContract: (contract) =>
    set((state) => ({ contracts: { ...state.contracts, [contract.name]: contract } })),
}));
