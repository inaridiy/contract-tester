import { loadAbi } from "@/utils/loadAbi";
import { ethers } from "ethers";
import { useRecoilCallback, useRecoilState } from "recoil";
import { ProviderState } from "../web3";
import { ContractDataListState, ContractTagState } from "./atoms";
import { ToolDataSelector } from "./selector";
import { ContractData } from "./types";

export const useLoadContract = () => {
  const loadContract = useRecoilCallback(
    ({ set, snapshot }) =>
      async (data: ContractData) => {
        const providerLoadable = snapshot.getLoadable(ProviderState);
        const dataListLoadable = snapshot.getLoadable(ContractDataListState);
        const provider = providerLoadable.getValue();

        if (!data.abi && !provider) return;
        if (!data.abi) data.fuzzy = true;

        const abi =
          data.abi ||
          (await loadAbi(provider as ethers.providers.Provider, data.address));

        set(ContractDataListState, {
          ...dataListLoadable.getValue(),
          [data.tag || ""]: { ...data, abi },
        });
        set(ContractTagState, data.tag);
      },
    []
  );
  return { loadContract };
};

export const useRemoveContract = () => {
  const removeContract = useRecoilCallback(
    ({ set, snapshot }) =>
      (tag: string) => {
        const dataListLoadable = snapshot.getLoadable(ContractDataListState);
        const dataList = dataListLoadable.getValue();
        const { [tag]: _, ...other } = dataList;
        set(ContractDataListState, {
          ...other,
        });
        set(ContractTagState, null);
      },
    []
  );
  return { removeContract };
};

export const useToolData = () => {
  const [toolData, setToolData] = useRecoilState(ToolDataSelector);
  const setScript = (script: string) => setToolData({ ...toolData, script });
  const setByteCode = (byteCode: string) =>
    setToolData({ ...toolData, byteCode });
  return { toolData, setToolData, setScript, setByteCode };
};
