import { atom } from "recoil";
import { ContractData } from "./types";

export const ContractTagState = atom<string | null>({
  key: "ContractTagState",
  default: null,
});

export const ContractDataListState = atom<{ [k in string]: ContractData }>({
  key: "ContractDataListState",
  default: {},
});
