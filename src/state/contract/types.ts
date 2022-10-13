export type ContractData = {
  tag: string;
  address: string;
  backProxy: boolean;
  abi?: string | string[];
  fuzzy?: boolean;
};
