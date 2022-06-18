import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";
import Router from "next/router";

export default function SignInButton() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleLogin = (response) => {
    const decoded = jwtDecode(response.credential);
    axios
      .post(`/api/auth/checkEmail`, {
        email: decoded.email,
        image: decoded.picture,
      })
      .then((res) => {
        toast.success("Sukses Login, Mengalihkan Halaman...");
        Router.push("/admin");
      })
      .catch((err) => {
        console.log(err.response.data);
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    if (scriptLoaded) return undefined;

    const initializeGoogle = () => {
      if (!window.google || scriptLoaded) return;

      setScriptLoaded(true);
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {
          theme: "outline",
          size: "large",
        }
      );
    };

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogle;
    script.async = true;
    script.id = "google-client-script";
    document.querySelector("body")?.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
      document.getElementById("google-client-script")?.remove();
    };
  }, [scriptLoaded]);

  return <div id="signInDiv"></div>;
}
