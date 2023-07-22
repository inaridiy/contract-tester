"use client";

import { memo } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ContractData } from "@/types/contract-data";
import { getOnlyFunction } from "@/types/solidity";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// eslint-disable-next-line react/display-name
export const CallContractEditor: React.FC<{ contract: ContractData }> = memo(({ contract }) => {
  console.log("CallContractEditor", contract);

  const funcs = getOnlyFunction(contract.abi);

  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold tracking-tight">{contract.name}</h2>
      </div>
      <div className="grid gap-4 p-4">
        {funcs.map((func) => (
          <Card key={func.name}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">{func.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid w-full items-center gap-2 px-4 py-0">
              {func.inputs.map((input) => (
                <div key={input.name}>
                  <Label htmlFor={input.name}>{input.name}</Label>
                  <Input id={input.name} placeholder={input.type} />
                </div>
              ))}
            </CardContent>
            <CardFooter className="grid justify-end gap-4 p-4">
              <Button>Call</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
});
