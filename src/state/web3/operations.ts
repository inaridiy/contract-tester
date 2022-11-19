import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { useRecoilCallback } from "recoil";
import Web3Modal from "web3modal";
import { ProviderState } from "./atoms";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: "https://mainnet.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        5: "https://goerli.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        11155111:
          "https://sepolia.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        137: "https://polygon-mainnet.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        80001:
          "https://polygon-mumbai.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        10: "https://optimism-mainnet.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        420: "https://optimism-goerli.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        43114:
          "https://avalanche-mainnet.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        43113:
          "https://avalanche-fuji.infura.io/v3/ddac2247725f422196229bfba8ac3877",
        592: "https://astar.public.blastapi.io",
        336: "https://shiden.public.blastapi.io",
        81: "https://shibuya.public.blastapi.io",
      },
    },
  },
};

export const useConnectWallet = () => {
  const connectWallet = useRecoilCallback(({ set }) => async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      providerOptions,
    });
    console.log("YEASH");

    const eth = await web3Modal.connect();
    if (!eth) return alert("No web3 provider found");
    eth.request && (await eth.request({ method: "eth_requestAccounts" }));
    const provider = new ethers.providers.Web3Provider(eth);
    set(ProviderState, provider);
  });
  return { connectWallet };
};
