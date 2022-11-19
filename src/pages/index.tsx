import { useEffect } from "react";
import {
  ContractInput,
  ContractsTab,
  EncodePanel,
  EthersPlayground,
  Footer,
  FunctionPanel,
  Header,
} from "../components";

import { useContracts } from "../hooks/useContracts";
import { useWeb3 } from "../hooks/useWeb3";

function App() {
  const { connectWallet } = useWeb3();
  const { contract, loadSpaceFromShare } = useContracts();

  useEffect(() => {
    void connectWallet();
    const searchParams = new URLSearchParams(location.search);
    const sharedId = searchParams.get("id");
    sharedId && void loadSpaceFromShare(sharedId);
  }, []);

  return (
    <div className="bg-base-200 relative flex min-h-screen flex-col items-center">
      <Header />

      <div className="my-24 flex w-full max-w-screen-md flex-col gap-4 px-4">
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
      <Footer />
    </div>
  );
}

export default App;
