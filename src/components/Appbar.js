import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  useRizkiContext,
  setToggleSidebar,
  setCloseSidebar,
  setDarkMode,
  drawerWidth,
} from "context";
import { signOut } from "next-auth/react";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "close",
})(({ theme, open, close }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${close ? 0 : drawerWidth}px)`,
  }),
  ...(!open && {
    width: `calc(100% - ${close ? "0px" : theme.spacing(7)})`,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${close ? "0px" : theme.spacing(9)})`,
    },
    [theme.breakpoints.down("md")]: {
      width: `calc(100% - 0px)`,
    },
  }),
}));

function AppbarLayout() {
  const [init, action] = useRizkiContext();
  const { toggleSidebar, closeSidebar, darkMode } = init;

  const toggleDrawer = () => {
    setToggleSidebar(action, !toggleSidebar);
    setCloseSidebar(action, false);
  };

  return (
    <AppBar position="fixed" open={toggleSidebar} close={closeSidebar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <IconButton
          color="inherit"
          onClick={() => setDarkMode(action, !darkMode)}
        >
          <Brightness4OutlinedIcon />
        </IconButton>
        <IconButton onClick={signOut} color="inherit">
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default AppbarLayout;
