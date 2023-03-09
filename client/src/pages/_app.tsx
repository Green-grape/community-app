import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "../provider/auth";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { SWRConfig } from "swr";
import axios from "axios";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api/";
  Axios.defaults.withCredentials = true;
  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const isAuthRoute = authRoutes.includes(pathname);
  const fetcher=async(url:string)=>{
    try{
        const res=await axios.get(url);
        console.log(res.data);
        return res.data;
    }catch(e){
        console.error(e);
    }
  }
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossOrigin="anonymous"/>
      </Head>
      <SWRConfig value={{fetcher}}>
      <AuthProvider>
        {!isAuthRoute && <NavBar />}
        <div className={isAuthRoute ? "":"pt-12 bg-gray-400 min-h-screen"}>
          <Component {...pageProps} />;
        </div>
      </AuthProvider>
    </SWRConfig>
    </>
  );
}
