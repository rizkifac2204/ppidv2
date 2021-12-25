import { useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";

import Sidebar from "./Sidebar";

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <Sidebar />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpen(false)}
          onKeyDown={() => setOpen(false)}
        >
          <h1>HEai</h1>
        </Box>
      </Drawer>
      {children}
      {JSON.stringify(open)}
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open
      </Button> */}
    </>
  );
}

export default Layout;
