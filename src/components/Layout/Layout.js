import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { ThemeProvider } from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import Container from "@mui/material/Container";

// components self
import Sidebar from "./Sidebar/Sidebar";
import Appbar from "./Appbar/Appbar";
import { useRizkiContext, lightTheme, darkTheme } from "context";

export default function Layout({ children }) {
  const [controller, dispatch] = useRizkiContext();
  const { darkMode } = controller;
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Appbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            p: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <Toolbar />
            <Container maxWidth={false}>{children}</Container>
          </PerfectScrollbar>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
