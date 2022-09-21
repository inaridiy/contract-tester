import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ContractData } from "./types";

const { persistAtom } = recoilPersist();

export const ContractTagState = atom<string | null>({
  key: "ContractTagState",
  default: null,
  effects: [persistAtom],
});

export const ContractDataListState = atom<{ [k in string]: ContractData }>({
  key: "ContractDataListState",
  default: {},
  effects: [persistAtom],
});
