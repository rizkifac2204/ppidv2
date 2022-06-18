import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";
import Router from "next/router";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    // maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

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

  return (
    <>
      <div id="signInDiv"></div>
      <HtmlTooltip
        title={
          <>
            <Typography color="inherit" variant="title">
              Daftarkan/isi email pada Halaman Profile untuk dapat Login kedalam
              Aplikasi lebih mudah
            </Typography>
          </>
        }
      >
        <HelpIcon />
      </HtmlTooltip>
    </>
  );
}
