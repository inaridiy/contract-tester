import { ProviderState, useConnectWallet } from "@/state/web3";
import { useRecoilValue } from "recoil";

export const useWeb3 = () => {
  const { connectWallet } = useConnectWallet();
  const provider = useRecoilValue(ProviderState);
  return { connectWallet, provider };
};
