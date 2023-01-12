import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { AuthProvider } from "../provider/auth";

export default function App({ Component, pageProps }: AppProps) {
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api/";
  return (
    <AuthProvider>
      <Component {...pageProps} />;
    </AuthProvider>
  );
}
