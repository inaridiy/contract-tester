import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useContracts } from "../hooks/useContracts";

export const ContractsTab = () => {
  const { contractDataList, contractTag, setContractTag, removeContract } =
    useContracts();

  return (
    <div className="tabs tabs-boxed mx-auto">
      {contractDataList &&
        Object.keys(contractDataList).map((key) =>
          contractTag !== key ? (
            <button
              key={key}
              className={clsx("tab tab-lg items-center")}
              onClick={() => setContractTag(key)}
            >
              {key}
            </button>
          ) : (
            <div key={key} className="tab tab-lg tab-active items-center">
              {key}
              {contractTag === key && (
                <button
                  className="btn btn-square btn-ghost btn-sm"
                  onClick={() => removeContract(key)}
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>
              )}
            </div>
          )
        )}
    </div>
  );
};
