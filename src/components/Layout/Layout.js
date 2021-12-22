import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

function Layout({ children }) {
  return (
    <>
      with Layout
      <Button variant="outlined" onClick={() => signOut()}>
        Logout
      </Button>
      {children}
    </>
  );
}

export default Layout;
