import { useContracts } from "@/hooks/useContracts";
import { useWeb3 } from "@/hooks/useWeb3";
import Editor, { useMonaco } from "@monaco-editor/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
const demoCode = `/* already imported ethers for global
inserted Web3Provider as provider to global
inserted Loaded Contract as contract */

const signer = provider.getSigner();
const address = await signer.getAddress();
const balance = await provider.getBalance(address);
console.log(\`\${address} has \${ethers.utils.formatEther(balance)}ETH\`);
`;

export const EthersPlayground = () => {
  const monaco = useMonaco();
  const { provider } = useWeb3();
  const { contract } = useContracts();
  const [code, setCode] = useState(demoCode);
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

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        "export declare function foo():string;",
        "file:///node_modules/@types/index.d.ts"
      );
    }
  }, [monaco]);

  return (
    <div className="card bg-base-100 gap-4 py-4 shadow-lg">
      <h2 className="px-4 text-2xl font-bold">Ethers Playground</h2>
      <Editor
        height="32vh"
        defaultLanguage="javascript"
        defaultValue={demoCode}
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
