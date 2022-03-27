import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabaseClient } from "../utils/client";
import queryString from "query-string";

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#635BFF",
      text: "#1D1D1D",
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const user = supabaseClient.auth.user();

  // Listener Method, which gives two events signed_in and signed_out
  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        handleAuthSession(event, session);
        // If signed in - push to home page
        if (event === "SIGNED_IN" && router.pathname !== "/reset-password") {
          router.push("/");
        }
        // If signed out, push to sign in page
        if (event === "SIGNED_OUT") {
          router.push("/signin");
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [router]);

  // Listen to any changes on router.pathname, user or router
  // If user is true, push to home page
  // useEffect(() => {
  //   if (user) {
  //     if (router.pathname === "/signin") {
  //       router.push("/");
  //     }
  //   }
  // }, [router.pathname, user, router]);

  // Function to make the post request to AUTH api to set cookie
  const handleAuthSession = async (event, session) => {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
