import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta name="application-name" content="PWA App" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Contract Tester" />
          <meta name="description" content="Contact Tester" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#000000" />

          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://contract-tester.xyz/" />
          <meta name="twitter:title" content="Contract Tester" />
          <meta name="twitter:description" content="Contract Tester" />
          <meta
            name="twitter:image"
            content="https://contract-tester.xyz/icon-192x192.png"
          />
          <meta name="twitter:creator" content="@inaridiy" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Contract Tester" />
          <meta property="og:description" content="Contract Tester" />
          <meta property="og:site_name" content="Contract Tester" />
          <meta property="og:url" content="https://contract-tester.xyz/" />
          <meta
            property="og:image"
            content="https://contract-tester.xyz/icon-192x192.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
