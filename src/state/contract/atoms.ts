import { atom, atomFamily } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ContractData } from "./types";

const { persistAtom } = recoilPersist();

const demoCode = `/* already imported ethers for global
inserted Web3Provider as provider to global
inserted Loaded Contract as contract */

const signer = provider.getSigner();
const address = await signer.getAddress();
const balance = await provider.getBalance(address);
console.log(\`\${address} has \${ethers.utils.formatEther(balance)}ETH\`);
`;

export const ContractTagState = atom<string | null>({
  key: "ContractTagState",
  default: null,
  effects: [persistAtom],
});

export const ContractDataListState = atom<{ [k in string]: ContractData }>({
  key: "ContractDataListState",
  default: {},
  effects: [persistAtom],
});

export const ContractToolDataStates = atomFamily<
  { byteCode: string; script: string },
  string
>({
  key: "ContractToolDataStates",
  default: () => ({ byteCode: "", script: demoCode }),
  effects: [persistAtom],
});
