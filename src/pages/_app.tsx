import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

import { NoSSR } from "../components";
import "../index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NoSSR>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </NoSSR>
  );
}
