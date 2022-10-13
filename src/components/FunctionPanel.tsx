import { useContracts } from "@/hooks/useContracts";
import { useWeb3 } from "@/hooks/useWeb3";
import clsx from "clsx";
import { Contract, ethers } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import { useState } from "react";

export const FunctionPanel: React.FC<{
  name: string;
  contract: Contract;
  fragment: FunctionFragment;
}> = ({ name, contract, fragment }) => {
  const { provider } = useWeb3();
  const { contractData } = useContracts();
  const [payValue, setPayValue] = useState("");
  const [args, setArgs] = useState<string[]>(
    Array(fragment.inputs.length).fill("")
  );
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const runFunction = async ({ call = false } = {}) => {
    setResult("");
    setError("");
    setIsLoading(true);

    try {
      const fixedArgs = args.map((value, i) =>
        fragment.inputs[i].baseType === "array"
          ? value
              .slice(1, -1)
              .split(",")
              .map((v) => v.trim())
          : fragment.inputs[i].baseType === "bool"
          ? value === "true"
            ? true
            : false
          : value
      );
      /* eslint-disable */
      if (call && contractData?.fuzzy) {
        const calldata = await contract.interface.encodeFunctionData(
          fragment,
          fixedArgs
        );
        const result = await provider?.call({
          to: contract.address,
          data: calldata,
        });
        setResult(ethers.utils.hexStripZeros(result || "0x"));
      } else {
        const result = await contract[name](...fixedArgs, {
          value: ethers.utils.parseEther(payValue || "0"),
        });
        setResult(JSON.stringify(result, null, "\t"));
      }
      /* eslint-enable */
    } catch (e) {
      setError(String((e as Error).message) || "Some Error Happen");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="card bg-base-100 card-body p-4 shadow-lg">
      <h2 className="cart-title text-2xl font-bold">{name}</h2>
      {fragment.payable && (
        <div className="flex flex-col gap-2 px-2">
          <label className="text-lg font-bold">{name}</label>
          <input
            className="input bg-base-200 input-md text-lg"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]*$"
            value={payValue}
            onChange={(e) => setPayValue(e.target.value)}
            placeholder="Pay Value"
          />
        </div>
      )}
      {fragment.inputs.map((input, i) => (
        <div key={`${name}/${i}`} className="flex flex-col gap-2 px-2">
          <label className="text-lg font-bold">
            {input.name || input.type}
          </label>
          <input
            className="input bg-base-200 input-md text-lg"
            type="text"
            value={args[i]}
            onChange={(e) =>
              setArgs(args.map((a, j) => (i === j ? e.target.value : a)))
            }
            placeholder={
              input.name ? `${input.name} (${input.type})` : input.type
            }
          />
        </div>
      ))}
      {result && (
        <div className="text-lg font-bold">
          <pre className="overflow-x-auto">Result: {result}</pre>
        </div>
      )}
      {error && (
        <div className="text-error text-lg font-bold">Error: {error}</div>
      )}
      <div className="flex gap-2">
        <button
          className={clsx(
            "btn btn-primary flex-1",
            isLoading && "disabled loading"
          )}
          onClick={() => void runFunction()}
        >
          Run
        </button>
        {contractData?.fuzzy && (
          <button
            className={clsx(
              "btn btn-secondary flex-1",
              isLoading && "disabled loading"
            )}
            onClick={() => void runFunction({ call: true })}
          >
            Call
          </button>
        )}
      </div>
    </div>
  );
};
