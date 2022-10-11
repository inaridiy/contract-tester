import { useContracts } from "@/hooks/useContracts";
import { useWeb3 } from "@/hooks/useWeb3";
import { useToolData } from "@/state/contract";
import Editor, { useMonaco } from "@monaco-editor/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const EthersPlayground = () => {
  const monaco = useMonaco();
  const { provider } = useWeb3();
  const { contract, contractTag } = useContracts();
  const { toolData, setScript } = useToolData();
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const runScript = async () => {
    // @ts-expect-error: YEAH
    window.ethers = ethers;
    // @ts-expect-error: YEAH
    window.provider = provider;
    // @ts-expect-error: YEAH
    window.contract = contract;

    const backup = console.log;
    setError("");
    try {
      let resultTmp = results;
      window.console.log = (any) => {
        resultTmp = [...resultTmp, String(any)];
      };
      await eval(`(async ()=>{${toolData.script}})()`);
      setResults(resultTmp);
    } catch (e) {
      setError(String(e));
    } finally {
      window.console.log = backup;
    }
  };

  useEffect(() => {
    if (monaco) {
      // // monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      // //   allowNonTsExtensions: true,
      // //   moduleResolution:
      // //     monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      // //   module: monaco.languages.typescript.ModuleKind.CommonJS,
      // //   noEmit: true,
      // //   typeRoots: ["node_modules/@types"],
      // // });
      // monaco.languages.typescript.typescriptDefaults.addExtraLib(
      //   "export declare function add(a: number, b: number): number",
      //   "node_modules/@types/external/index.d.ts"
      // );
      // monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      //   noSemanticValidation: false,
      //   noSyntaxValidation: false,
      // });
      // console.log(
      //   monaco.languages.typescript.typescriptDefaults.getExtraLibs()
      // );
    }
  }, [monaco]);

  return (
    <div className="card bg-base-100 gap-4 py-4 shadow-lg">
      <h2 className="px-4 text-2xl font-bold">Ethers Playground</h2>
      <Editor
        height="32vh"
        defaultLanguage="javascript"
        path={`files:///${contractTag || "default"}.js`}
        defaultValue={toolData.script}
        onChange={(e) => setScript(e || "")}
      />
      <button className="btn btn-primary mx-4" onClick={runScript}>
        Run
      </button>
      {results.length > 0 && (
        <pre className="mockup-code mx-4 overflow-x-auto pl-2">
          {results.map((result, i) => (
            <pre data-prefix="$" key={`${i}/${result}`}>
              <code>{result}</code>
            </pre>
          ))}
        </pre>
      )}
      {error && (
        <div className="text-error text-lg font-bold">Error: {error}</div>
      )}
    </div>
  );
};
