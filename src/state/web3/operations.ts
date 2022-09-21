import { ethers } from "ethers";
import { useRecoilCallback } from "recoil";
import { ProviderState } from "./atoms";

export const useConnectWallet = () => {
  const connectWallet = useRecoilCallback(({ set }) => async () => {
    // @ts-expect-error eth is ok
    const eth = window.ethereum as ethers.providers.ExternalProvider;
    if (!eth) return alert("No web3 provider found");
    eth.request && (await eth.request({ method: "eth_requestAccounts" }));
    const provider = new ethers.providers.Web3Provider(eth);
    set(ProviderState, provider);
  });
  return { connectWallet };
};
