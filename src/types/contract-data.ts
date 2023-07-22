import { Abi } from "viem";

export type ProxyType = "eip1822" | "eip1967"; // and more

export interface ABIContractData {
  name: string;
  address: string;
  abi: any[];
  parsedAbi: Abi;
}

export type ContractData = ABIContractData;
