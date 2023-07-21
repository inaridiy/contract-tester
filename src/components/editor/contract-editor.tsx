"use client";

import { memo } from "react";

import { ContractData } from "@/types/contract-data";

// eslint-disable-next-line react/display-name
export const ContractEditor: React.FC<{ contract: ContractData }> = memo(({ contract }) => {
  return (
    <div className="p-4 pt-2">
      <h2 className="text-2xl font-bold tracking-tight">{contract.name}</h2>
    </div>
  );
});
