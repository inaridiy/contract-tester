import dynamic from "next/dynamic";

const _NoSSR: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const NoSSR = dynamic(() => Promise.resolve(_NoSSR), { ssr: false });
