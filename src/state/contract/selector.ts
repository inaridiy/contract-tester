import { ethers } from "ethers";
import { selector } from "recoil";
import { ProviderState } from "../web3";
import {
  ContractDataListState,
  ContractTagState,
  ContractToolDataStates,
} from "./atoms";

export const ContractSelector = selector({
  key: "ContractSelector",
  get: ({ get }) => {
    const provider = get(ProviderState);
    const tag = get(ContractTagState);
    const contractDataList = get(ContractDataListState);
    const data = tag && contractDataList[tag];
    const contract =
      data &&
      new ethers.Contract(data.address, data.abi || [], provider?.getSigner());

    return contract;
  },
  dangerouslyAllowMutability: true,
});

export const ToolDataSelector = selector({
  key: "ToolSelector",
  get: ({ get }) => {
    const tag = get(ContractTagState) || "_default_";
    const toolData = get(ContractToolDataStates(tag));
    return toolData;
  },
  set: ({ get, set }, newData) => {
    const tag = get(ContractTagState) || "_default_";
    set(ContractToolDataStates(tag), newData);
  },
});
