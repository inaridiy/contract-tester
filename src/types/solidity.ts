import { AbiFunction } from "abitype";
import { Abi, parseAbi } from "viem";

export const alignToAbi = (maybeAbi: string[] | Abi): Abi => {
  if (Array.isArray(maybeAbi) && typeof maybeAbi[0] === "string") {
    return parseAbi(maybeAbi);
  }
  return maybeAbi as Abi;
};

export const getOnlyFunction = (abi: Abi): AbiFunction[] => {
  return abi.filter((item) => item.type === "function") as AbiFunction[];
};
