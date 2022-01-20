import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useEffect } from "react";
// MUI
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import PerfectScrollbar from "react-perfect-scrollbar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
// components self
import Sidebar from "./Sidebar/Sidebar";
import Appbar from "./Appbar/Appbar";
import DrawerSetting from "./Appbar/DrawerSetting";
import BreadcrumbsHead from "./Breadcrumb";
import Footer from "./Footer";
// CURTOM
import {
  useRizkiContext,
  setToggleSidebar,
  setCloseSidebar,
  drawerWidth,
  setToggleSetting,
  setDarkMode,
  getDesignTokens,
  setPrimaryColor,
  setSecondaryColor,
} from "context";

export default function Layout({ children }) {
  const handleFullScreen = useFullScreenHandle();
  const [init, action] = useRizkiContext();
  const {
    toggleSidebar,
    closeSidebar,
    darkMode,
    toggleSetting,
    primary,
    secondary,
  } = init;

  const closeDrawer = () => {
    setToggleSidebar(action, !toggleSidebar);
    setCloseSidebar(action, true);
  };

  const toggleDrawer = () => {
    setToggleSidebar(action, !toggleSidebar);
    setCloseSidebar(action, false);
  };

  const toggleDrawerSetting = () => {
    setToggleSetting(action, !toggleSetting);
  };

  const changeMode = () => {
    setDarkMode(action, !darkMode);
  };

  const changePrimaryColor = (value) => {
    setPrimaryColor(action, value);
  };

  const changeSecondaryColor = (value) => {
    setSecondaryColor(action, value);
  };

  const theme = createTheme(
    getDesignTokens(darkMode ? "dark" : "light", primary, secondary)
  );

  return (
    <ThemeProvider theme={theme}>
      <FullScreen handle={handleFullScreen}>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <Appbar
            toggleSidebar={toggleSidebar}
            closeSidebar={closeSidebar}
            toggleDrawer={toggleDrawer}
            toggleDrawerSetting={toggleDrawerSetting}
            drawerWidth={drawerWidth}
          />

          <Sidebar
            toggleSidebar={toggleSidebar}
            closeSidebar={closeSidebar}
            darkMode={darkMode}
            closeDrawer={closeDrawer}
            drawerWidth={drawerWidth}
          />

          <Box
            component="main"
            sx={{
              p: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            {/* <PerfectScrollbar options={{ suppressScrollX: true }}> */}
            <Toolbar />
            <BreadcrumbsHead list={children.type.breadcrumb} />
            <Container maxWidth={false}>{children}</Container>
            <Footer />
            {/* </PerfectScrollbar> */}
          </Box>

          <DrawerSetting
            open={toggleSetting}
            toggleDrawerSetting={toggleDrawerSetting}
            changeMode={changeMode}
            changePrimaryColor={changePrimaryColor}
            changeSecondaryColor={changeSecondaryColor}
            darkMode={darkMode}
            handleFullScreen={handleFullScreen}
          />
        </Box>
      </FullScreen>
    </ThemeProvider>
  );
}
