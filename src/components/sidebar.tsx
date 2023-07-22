"use client";

import { Plus, Terminal } from "lucide-react";
import { memo } from "react";

import { cn } from "@/lib/utils";
import { useContractStore } from "@/store/contract-store";
import { ContractData } from "@/types/contract-data";

import { ImportContractDataDialog } from "./dialogs/import-contract-dialog";
import { Button } from "./ui/button";

export const Sidebar: React.FC<{ className: string }> = ({ className }) => {
  const contracts = useContractStore((state) => state.contracts);

  return (
    <div className={cn("overflow-y-auto flex flex-col p-2", className)}>
      <div className="mb-2 flex items-center">
        <h2 className="flex-1 px-4 text-lg font-semibold tracking-tight">Contracts</h2>
        <ImportContractDataDialog>
          <Button variant="ghost" className="h-8 w-8 px-0">
            <Plus className="h-4 w-4" />
          </Button>
        </ImportContractDataDialog>
      </div>
      <div className="w-full space-y-1">
        {Object.values(contracts).map((contract) => (
          <SidebarContractButton key={contract.address} contract={contract} />
        ))}

        {Object.values(contracts).length === 0 && (
          <div>
            <p className="text-sm text-gray-400">No contracts added yet.</p>
            <p className="text-sm text-gray-400">Click the button below to add one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line react/display-name
export const SidebarContractButton: React.FC<{ contract: ContractData }> = memo(({ contract }) => {
  const setSelectedContract = useContractStore((state) => state.setSelectedContract);
  const isSelected = useContractStore((state) => state.selectedContract === contract.name);

  const handleClick = () => setSelectedContract(contract.name);

  return (
    <Button
      variant="ghost"
      className={cn("w-full justify-start", isSelected && "bg-muted")}
      onClick={handleClick}
    >
      <Terminal className="mr-2 h-4 w-4" />
      {contract.name}
    </Button>
  );
});
