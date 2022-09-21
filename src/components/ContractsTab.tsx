import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useContracts } from "../hooks/useContracts";

export const ContractsTab = () => {
  const { contractDataList, contractTag, setContractTag, removeContract } =
    useContracts();

  return (
    <div className="tabs tabs-boxed mx-auto">
      {contractDataList &&
        Object.keys(contractDataList).map((key) => (
          <button
            key={key}
            className={clsx(
              "tab tab-lg items-center",
              contractTag === key && "tab-active"
            )}
            onClick={() => setContractTag(key)}
          >
            {key}
            {contractTag === key && (
              <button
                className="btn btn-square btn-ghost btn-sm"
                onClick={() => removeContract(key)}
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
            )}
          </button>
        ))}
    </div>
  );
};
