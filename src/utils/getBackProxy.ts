import { ethers } from "ethers";

const slots = [
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
  "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
  "0x7050c9e0f4ca769c69bd3a8ef740bc37934f8e2c036e5a723fd8ee048ed3f8c3",
];

export const getBackProxy = async (
  provider: ethers.providers.Provider,
  address: string
): Promise<string | null> => {
  for (const slot of slots) {
    const slotValue = await provider.getStorageAt(address, slot);
    const maybeAddress = ethers.utils.hexDataSlice(slotValue, 0, 96); //256bit => 160bit
    if (ethers.utils.isAddress(maybeAddress)) return maybeAddress;
  }
  return null;
};
