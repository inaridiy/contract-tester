import { useLoadContract } from "@/state/contract";
import {
  ContractDataListState,
  ContractTagState,
} from "@/state/contract/atoms";
import { ContractSelector } from "@/state/contract/selector";
import { useRecoilState, useRecoilValue } from "recoil";

export const useContracts = () => {
  const { loadContract } = useLoadContract();
  const contractDataList = useRecoilValue(ContractDataListState);
  const [contractTag, setContractTag] = useRecoilState(ContractTagState);
  const contract = useRecoilValue(ContractSelector);
  const contractData = contractTag ? contractDataList[contractTag] : null;

  return {
    loadContract,
    contractDataList,
    contractTag,
    setContractTag,
    contract,
    contractData,
  };
};
