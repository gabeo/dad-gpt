import { type AppProps } from "next/app";

import { api } from "~/utils/api";

import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>DadGPT</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
        <footer>
          <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center">
              © {`${new Date().getFullYear()} `}
              <a href="https://gigagabe.com/" className="hover:underline">
                GigaGabe™
              </a>
              . All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
