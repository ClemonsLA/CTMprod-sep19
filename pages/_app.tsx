import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.scss";
import React, { LegacyRef, useRef, useState } from "react";
import Hero from "../components/Hero/Hero";
import Footer from "../components/Footer/Footer";
import Context from '../context/context'
import SpinningLoader from "../components/SpinningLoader/SpinningLoader";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

const activeChain = ChainId.Mumbai;
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef<LegacyRef<HTMLDivElement> | any>();

  return (
    <QueryClientProvider client={queryClient}>
      <Context>
        {/*<div style={{backgroundColor: isDarkMode ?"#0f1318" : "#fff"}}>*/}
        <div ref={bodyRef}>
          {/*<CTMSidebar isSidebarOpen={isSidebarOpen} isDarkMode={isDarkMode} />*/}
          <div style={{ /*marginLeft: isSidebarOpen ? '250px' : 0*/ }}>
            <Hero isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} isDarkMode={isDarkMode} setDarkMode={setDarkMode} setLoading={setLoading} bodyRef={bodyRef} />
            {loading ? <SpinningLoader /> :
              <Component {...pageProps} setLoading={setLoading} />}
            <Footer />
          </div>
        </div>
        </Context>
        </QueryClientProvider>
  );
}

export default MyApp;
