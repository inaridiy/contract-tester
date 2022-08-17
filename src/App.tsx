import clsx from "clsx";
import { Contract, ethers } from "ethers";
import { FunctionFragment } from "ethers/lib/utils";
import { useState } from "react";

const FunctionPanel: React.FC<{
  name: string;
  contract: Contract;
  fragment: FunctionFragment;
  address: string;
}> = ({ name, contract, fragment, address }) => {
  const [payValue, setPayValue] = useState("");
  const [args, setArgs] = useState<string[]>(
    Array(fragment.inputs.length).fill("")
  );
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const runFunction = async () => {
    setResult("");
    setError("");
    setIsLoading(true);

    try {
      const fixedArgs = args.map((value, i) =>
        fragment.inputs[i].baseType !== "array"
          ? value
          : value
              .slice(1, -1)
              .split(",")
              .map((v) => v.trim())
      );
      // eslint-disable-next-line
      const result = await contract[name](...fixedArgs, {
        value: ethers.utils.parseEther(payValue || "0"),
      });
      setResult(JSON.stringify(result, null, "\t"));
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
      <button
        className={clsx("btn btn-primary", isLoading && "disabled loading")}
        onClick={() => void runFunction()}
      >
        Run
      </button>
    </div>
  );
};

function App() {
  const [abi, setAbi] = useState("");
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  const connect = async () => {
    // @ts-expect-error eth is ok
    const eth = window.ethereum as ethers.providers.ExternalProvider;
    if (!eth) return alert("No web3 provider found");
    eth.request && (await eth.request({ method: "eth_requestAccounts" }));
    const provider = new ethers.providers.Web3Provider(eth);
    setProvider(provider);
  };

  const loadContract = () => {
    if (!abi || !address || !provider) return;
    const contract = new ethers.Contract(address, abi, provider.getSigner());
    setContract(contract);
  };
  return (
    <div className="bg-base-200 relative flex min-h-screen flex-col items-center">
      <header className="navbar flex w-full justify-center">
        <nav className="navbar max-w-screen-lg justify-between">
          <button className="btn btn-ghost text-2xl normal-case">
            Contract Tester
          </button>
          {provider ? (
            <div className="btn btn-ghost text-lg normal-case">Connected</div>
          ) : (
            <button
              className="btn btn-info text-lg"
              onClick={() => void connect()}
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </header>
      <div className="flex w-full max-w-screen-md flex-col gap-2 px-4">
        <input
          className="input text-lg shadow-lg"
          type="text"
          placeholder="Contract Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <textarea
          className="input h-56 resize-none text-lg shadow-lg"
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
          placeholder="Contract Abi"
        ></textarea>
        <button className="btn" onClick={loadContract}>
          Load
        </button>
        {contract &&
          Object.entries(contract.interface.functions)
            .filter(([name]) => /\w*\([\w\W]*\)/g.test(name))
            .map(([name, fragment]) => (
              <FunctionPanel
                key={name}
                name={name}
                fragment={fragment}
                contract={contract}
                address={address}
              />
            ))}
      </div>
    </div>
  );
}

export default App;
