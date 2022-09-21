import { useRecoilCallback } from "recoil";
import { ContractDataListState, ContractTagState } from "./atoms";
import { ContractData } from "./types";

export const useLoadContract = () => {
  const loadContract = useRecoilCallback(
    ({ set, snapshot }) =>
      (data: ContractData) => {
        const dataListLoadable = snapshot.getLoadable(ContractDataListState);
        set(ContractDataListState, {
          ...dataListLoadable.getValue(),
          [data.tag || ""]: data,
        });
        set(ContractTagState, data.tag);
      },
    []
  );
  return { loadContract };
};
