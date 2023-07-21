"use client";

import { memo } from "react";

import { cn } from "@/lib/utils";
import { useContractStore } from "@/store/contract-store";
import { ContractData } from "@/types/contract-data";

import { AddContractDataDialog } from "../dialogs/add-contract-dialog";
import { Button } from "../ui/button";

export const Sidebar: React.FC<{ className: string }> = ({ className }) => {
  const contracts = useContractStore((state) => state.contracts);

  return (
    <div className={cn("overflow-y-auto flex flex-col p-2", className)}>
      {Object.values(contracts).map((contract) => (
        <SidebarContractButton key={contract.address} contract={contract} />
      ))}
      {Object.values(contracts).length === 0 && (
        <div className="">
          <p className="text-sm text-gray-400">No contracts added yet.</p>
          <p className="text-sm text-gray-400">Click the button below to add one.</p>
        </div>
      )}

      <div className="flex-1" />

      <AddContractDataDialog />
    </div>
  );
};

// eslint-disable-next-line react/display-name
export const SidebarContractButton: React.FC<{ contract: ContractData }> = memo(({ contract }) => {
  return (
    <Button variant="ghost" className="justify-start">
      {contract.name}
    </Button>
  );
});
