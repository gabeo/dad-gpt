import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </>
  );
}

export default api.withTRPC(MyApp);
