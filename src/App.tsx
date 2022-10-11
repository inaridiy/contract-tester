import {
  ContractInput,
  EncodePanel,
  FunctionPanel,
  Header,
} from "./components";
import { ContractsTab } from "./components/ContractsTab";
import { EthersPlayground } from "./components/EthersPlayground";
import { useContracts } from "./hooks/useContracts";

function App() {
  const { contract } = useContracts();

  return (
    <div className="bg-base-200 relative flex min-h-screen flex-col items-center">
      <Header />

      <div className="flex w-full max-w-screen-md flex-col gap-4 px-4">
        <ContractInput />
        <ContractsTab />
        <EncodePanel />
        <EthersPlayground />
        {contract &&
          Object.entries(contract.interface.functions)
            .filter(([name]) => /\w*\([\w\W]*\)/g.test(name))
            .map(([name, fragment]) => (
              <FunctionPanel
                key={name}
                name={name}
                fragment={fragment}
                contract={contract}
              />
            ))}
      </div>
    </div>
  );
}

export default App;
