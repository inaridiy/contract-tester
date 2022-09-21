import { ethers } from "ethers";
import { selector } from "recoil";
import { ProviderState } from "../web3";
import { ContractDataListState, ContractTagState } from "./atoms";

export const ContractSelector = selector({
  key: "ContractSelector",
  get: ({ get }) => {
    const provider = get(ProviderState);
    const tag = get(ContractTagState);
    const contractDataList = get(ContractDataListState);
    const data = tag && contractDataList[tag];
    const contract =
      data &&
      new ethers.Contract(data.address, data.abi, provider?.getSigner());

    return contract;
  },
  dangerouslyAllowMutability: true,
});
