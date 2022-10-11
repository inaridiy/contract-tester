import { useWeb3 } from "@/hooks/useWeb3";

export const Header = () => {
  const { provider, connectWallet } = useWeb3();
  return (
    <header className="fixed z-10 w-full max-w-screen-lg">
      <nav className="navbar justify-between">
        <button className="btn btn-ghost px-2 text-lg normal-case sm:text-2xl">
          Contract Tester
        </button>
        {provider ? (
          <div className="btn btn-ghost px-2 text-lg normal-case">
            Connected
          </div>
        ) : (
          <button
            className="btn btn-info px-2"
            onClick={() => void connectWallet()}
          >
            Connect Wallet
          </button>
        )}
      </nav>
    </header>
  );
};
