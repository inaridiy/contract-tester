"use client";

import { cn } from "@/lib/utils";
import { useContractStore } from "@/store/contract-store";

import { CallContractEditor } from "./call-contract-editor";

export const Editor: React.FC<{ className: string }> = ({ className }) => {
  const selectedContract = useContractStore((state) => state.selectedContract);
  const contract = useContractStore((state) => state.contracts[selectedContract || ""]);
  const contracts = useContractStore((state) => state.contracts);

  console.log("Editor", contract, selectedContract, contracts);

  return (
    <div className={cn("overflow-y-auto flex flex-col", className)}>
      {contract && <CallContractEditor contract={contract} />}
    </div>
  );
};
