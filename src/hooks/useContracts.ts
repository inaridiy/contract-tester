import {
  useLoadContract,
  useLoadSpace,
  useRemoveContract,
  useSaveSpace,
  useShareSpace,
} from "@/state/contract";
import {
  ContractDataListState,
  ContractTagState,
} from "@/state/contract/atoms";
import { ContractSelector } from "@/state/contract/selector";
import { useRecoilState, useRecoilValue } from "recoil";

export const useContracts = () => {
  const { loadContract } = useLoadContract();
  const { removeContract } = useRemoveContract();
  const contractDataList = useRecoilValue(ContractDataListState);
  const [contractTag, setContractTag] = useRecoilState(ContractTagState);
  const contract = useRecoilValue(ContractSelector);
  const contractData = contractTag ? contractDataList[contractTag] : null;
  const { saveSpace } = useSaveSpace();
  const { loadSpaceFromFile } = useLoadSpace();
  const { shareSpace } = useShareSpace();

  return {
    loadContract,
    removeContract,
    contractDataList,
    contractTag,
    setContractTag,
    contract,
    contractData,
    saveSpace,
    loadSpaceFromFile,
    shareSpace,
  };
};
