import { useContracts } from "@/hooks/useContracts";
import { useToolData } from "@/state/contract";
import { EventFragment, FunctionFragment } from "ethers/lib/utils";
import React, { useCallback, useState } from "react";

export const EncodePanel = () => {
  const { contract } = useContracts();
  const [func, setFunc] = useState<FunctionFragment | EventFragment | null>(
    null
  );
  const [target, setTarget] = useState("");
  const { toolData, setByteCode } = useToolData();
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedFunc =
        (contract &&
          Object.entries(contract.interface.functions).find(
            ([name]) => name === e.target.value
          )) ||
        (contract &&
          Object.entries(contract.interface.events).find(
            ([name]) => name === e.target.value
          ));
      setFunc(selectedFunc ? selectedFunc[1] : null);
    },
    [contract]
  );

  const encode = useCallback(() => {
    if (!func || !contract) return;
    try {
      if (func instanceof FunctionFragment) {
        const result =
          target === "FunctionData"
            ? contract.interface.encodeFunctionData(
                func,
                JSON.parse(toolData.byteCode) as never
              )
            : target === "FunctionResult"
            ? contract.interface.encodeFunctionResult(
                func,
                JSON.parse(toolData.byteCode) as never
              )
            : "";
        setResult(result);
      } else if (func instanceof EventFragment) {
        const result =
          target === "EventLog"
            ? contract.interface.encodeEventLog(
                func,
                JSON.parse(toolData.byteCode) as never
              )
            : "";
        setResult(JSON.stringify(result, null, "\t"));
      }
    } catch (e) {
      setError(String((e as Error).message) || "Some Error Happen");
      console.error(e);
    }
  }, [contract, func, toolData.byteCode, target]);

  const decode = useCallback(() => {
    if (!func || !contract) return;
    try {
      if (func instanceof FunctionFragment) {
        const result =
          target === "FunctionData"
            ? contract.interface.decodeFunctionData(func, toolData.byteCode)
            : target === "FunctionResult"
            ? contract.interface.decodeFunctionResult(func, toolData.byteCode)
            : "";
        setResult(JSON.stringify(result, null, "\t"));
      } else if (func instanceof EventFragment) {
        const result =
          target === "EventLog"
            ? contract.interface.decodeEventLog(
                func,
                JSON.parse(toolData.byteCode) as never
              )
            : "";
        setResult(JSON.stringify(result, null, "\t"));
      }
    } catch (e) {
      setError(String((e as Error).message) || "Some Error Happen");
      console.error(e);
    }
  }, [contract, func, toolData.byteCode, target]);

  if (!contract) return <></>;
  return (
    <div className="card bg-base-100 flex w-full flex-col gap-2 p-4 shadow-lg">
      <h2 className="text-2xl font-bold">Byte Data Tool</h2>
      <div className="flex">
        <select
          className="select bg-base-200 select-bordered w-full"
          onChange={handleChange}
        >
          <option>None</option>
          {Object.entries(contract.interface.functions)
            .filter(([name]) => /\w*\([\w\W]*\)/g.test(name))
            .map((func) => (
              <option key={func[0]} value={func[0]}>
                {func[0]}
              </option>
            ))}
          {Object.entries(contract.interface.events)
            .filter(([name]) => /\w*\([\w\W]*\)/g.test(name))
            .map((event) => (
              <option key={event[0]} value={event[0]}>
                {event[0]}
              </option>
            ))}
        </select>
      </div>
      <select
        className="select bg-base-200 select-bordered w-full"
        onChange={(e) => setTarget(e.target.value)}
      >
        <option>None</option>
        {func instanceof FunctionFragment ? (
          <>
            <option>FunctionData</option>
            <option>FunctionResult</option>
          </>
        ) : func instanceof EventFragment ? (
          <option>EventLog</option>
        ) : (
          <></>
        )}
      </select>
      <textarea
        className="input bg-base-200 h-56 resize-none py-2 text-lg"
        placeholder="Type byte Data"
        value={toolData.byteCode}
        onChange={(e) => setByteCode(e.target.value)}
      />
      {result && (
        <div className="text-lg font-bold">
          <pre className="overflow-x-auto">Result: {result}</pre>
        </div>
      )}
      {error && (
        <div className="text-error text-lg font-bold">Error: {error}</div>
      )}
      <div className="flex gap-4">
        <button className="btn btn-primary flex-1" onClick={encode}>
          Encode
        </button>
        <button className="btn btn-secondary flex-1" onClick={decode}>
          Decode
        </button>
      </div>
    </div>
  );
};
