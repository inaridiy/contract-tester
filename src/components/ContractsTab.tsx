import clsx from "clsx";
import { useContracts } from "../hooks/useContracts";

export const ContractsTab = () => {
  const { contractDataList, contractTag, setContractTag } = useContracts();
  return (
    <div className="tabs tabs-boxed mx-auto">
      {contractDataList &&
        Object.keys(contractDataList).map((key) => (
          <button
            key={key}
            className={clsx("tab tab-lg", contractTag === key && "tab-active")}
            onClick={() => setContractTag(key)}
          >
            {key}
          </button>
        ))}
    </div>
  );
};
