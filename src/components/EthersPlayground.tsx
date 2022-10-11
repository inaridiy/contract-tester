import { useContracts } from "@/hooks/useContracts";
import { useWeb3 } from "@/hooks/useWeb3";
import Editor from "@monaco-editor/react";
import { ethers } from "ethers";
import { useState } from "react";

export const EthersPlayground = () => {
  const { provider } = useWeb3();
  const { contract } = useContracts();
  const [code, setCode] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const runScript = async () => {
    // @ts-expect-error: YEAH
    window.ethers = ethers;
    // @ts-expect-error: YEAH
    window.provider = provider;
    // @ts-expect-error: YEAH
    window.contract = contract;

    const backup = console.log;
    let resultTmp = results;
    window.console.log = (any) => {
      resultTmp = [...resultTmp, String(any)];
    };
    await eval(`(async ()=>{${code}})()`);
    window.console.log = backup;
    setResults(resultTmp);
  };

  return (
    <div className="card bg-base-100 gap-4 py-4 shadow-lg">
      <h2 className="px-4 text-2xl font-bold">Ethers Playground</h2>
      <Editor
        height="45vh"
        defaultLanguage="javascript"
        defaultValue="//already imported ethers for global"
        onChange={(e) => setCode(e || "")}
      />
      <button className="btn btn-primary mx-4" onClick={runScript}>
        Run
      </button>
      {results.length > 0 && (
        <pre className="mockup-code mx-4 overflow-x-auto">
          {results.map((result, i) => (
            <pre data-prefix="$" key={`${i}/${result}`}>
              <code>{result}</code>
            </pre>
          ))}
        </pre>
      )}
    </div>
  );
};
