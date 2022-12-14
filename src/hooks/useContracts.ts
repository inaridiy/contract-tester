import {
  useClearContract,
  useLoadContract,
  useLoadSpace,
  useLoadSpaceFromShare,
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
  const { clearContract } = useClearContract();
  const contractDataList = useRecoilValue(ContractDataListState);
  const [contractTag, setContractTag] = useRecoilState(ContractTagState);
  const contract = useRecoilValue(ContractSelector);
  const contractData = contractTag ? contractDataList[contractTag] : null;
  const { saveSpace } = useSaveSpace();
  const { loadSpaceFromFile } = useLoadSpace();
  const { shareSpace } = useShareSpace();
  const { loadSpaceFromShare } = useLoadSpaceFromShare();

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
    clearContract,
    loadSpaceFromShare,
  };
};
