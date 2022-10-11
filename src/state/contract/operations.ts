import { useRecoilCallback, useRecoilState } from "recoil";
import { ContractDataListState, ContractTagState } from "./atoms";
import { ToolDataSelector } from "./selector";
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
