import { whatsabi } from "@shazow/whatsabi";
import { ethers } from "ethers";
import { getBackProxy } from "./getBackProxy";

export const loadAbi = async (
  provider: ethers.providers.Provider,
  _address: string,
  { backProxy = true }: { backProxy?: boolean } = {}
) => {
  const address = backProxy
    ? (await getBackProxy(provider, _address)) || _address
    : _address;
  const code = await provider.getCode(address);

  const signatureLookup = new whatsabi.loaders.SamczunSignatureLookup();
  const abiLike = whatsabi.abiFromBytecode(code);

  const abi = await Promise.all(
    abiLike.map((funcOrEvent) =>
      funcOrEvent.type === "function"
        ? signatureLookup
            .loadFunctions(funcOrEvent.selector)
            .then((value) =>
              value[0]
                ? `function ${value[0]} ${funcOrEvent.payable ? "payable" : ""}`
                : ""
            )
        : signatureLookup
            .loadEvents(funcOrEvent.hash)
            .then((value) => (value[0] ? `event ${value[0]}` : ""))
    )
  );
  const abiJson = JSON.stringify(
    abi.filter((v) => v),
    null,
    "\t"
  );

  return abiJson;
};
