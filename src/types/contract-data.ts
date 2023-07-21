export type ProxyType = "eip1822" | "eip1967"; // and more

export interface ABIContractData {
  name: string;
  address: string;
  abi: any[];
}

export interface StandardJSONContractData {
  name: string;
  address: string;
  json: any;
}

export type ContractData = ABIContractData | StandardJSONContractData;
