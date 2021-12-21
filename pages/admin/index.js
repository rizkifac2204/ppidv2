import { signOut } from "next-auth/react";
import { Button } from "@mui/material";

function Index() {
  return (
    <>
      <div>
        Dashboard Admin
        <Button variant="outlined" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
    </>
  );
}

Index.auth = true;
export default Index;
