import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// components
import TopRight from "./TopRight";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "close" && prop !== "drawerWidth",
})(({ theme, open, close, drawerWidth }) => ({
  // zIndex: theme.zIndex.drawer + 1,
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

function AppbarLayout(props) {
  return (
    <AppBar
      position="absolute"
      open={props.toggleSidebar}
      close={props.closeSidebar}
      drawerWidth={props.drawerWidth}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <TopRight toggleDrawerSetting={props.toggleDrawerSetting} />
      </Toolbar>
    </AppBar>
  );
}

export default AppbarLayout;
