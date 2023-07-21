import { create } from "zustand";

export interface ContractStoreState {}

export interface ContractStoreActions {}

export const useContractStore = create<ContractStoreState & ContractStoreActions>((set) => ({}));
