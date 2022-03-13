import Head from "next/head";
import Layout from "components/Layout/Layout";
import PublicLayout from "components/Layout/PublicLayout";
import "../styles/globals.css";
import "react-perfect-scrollbar/dist/css/styles.css";

// Toast dibutuhkan pada semua halaman termasuk saat logout
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Progess dibutuhkan pada semua halaman termasuk saat logout
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { SessionProvider, useSession, signIn } from "next-auth/react";
import { useEffect } from "react";

// Router berjalan termasuk saat logout
import Router from "next/router";
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

import { ContextProvider } from "context";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>PPID</title>
      </Head>
      <ToastContainer />
      <SessionProvider session={session}>
        {Component.auth ? (
          <Auth>
            <ContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ContextProvider>
          </Auth>
        ) : (
          <>
            {Component.public ? (
              <PublicLayout>
                <Component {...pageProps} />
              </PublicLayout>
            ) : (
              <Component {...pageProps} />
            )}
          </>
        )}
      </SessionProvider>
    </>
  );
}

// Dibawah ini adalah untuk memudahkan semua Page dengan
// hanya menambahkan DiferentWay.auth = true pada tiap page bagian bawah
function Auth({ children }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) Router.push("/"); // signIn() // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}

export default MyApp;
