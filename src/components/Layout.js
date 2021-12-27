import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { ThemeProvider } from "@mui/material/styles";

// components self
import Sidebar from "./Sidebar";
import { useRizkiContext, lightTheme, darkTheme } from "context";

export default function Layout({ children }) {
  const [controller, dispatch] = useRizkiContext();
  const { darkMode } = controller;
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Sidebar />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          {JSON.stringify(controller)}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
