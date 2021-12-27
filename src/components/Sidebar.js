import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Brightness4OutlinedIcon from "@mui/icons-material/Brightness4Outlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import {
  useRizkiContext,
  setToggleSidebar,
  setCloseSidebar,
  setDarkMode,
  drawerWidth,
} from "context";

const openedMixin = (theme, close) => ({
  width: close ? 0 : drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme, close) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: close ? 0 : `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.down("sm")]: {
    width: 0,
  },
  [theme.breakpoints.up("sm")]: {
    width: close ? 0 : `calc(${theme.spacing(9)} + 1px)`,
  },
});

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
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${close ? "0px" : theme.spacing(9)})`,
    },
    [theme.breakpoints.down("sm")]: {
      width: `calc(100% - 0px)`,
    },
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "close",
})(({ theme, open, close }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme, close),
    "& .MuiDrawer-paper": openedMixin(theme, close),
  }),
  ...(!open && {
    ...closedMixin(theme, close),
    "& .MuiDrawer-paper": closedMixin(theme, close),
  }),
}));

function Sidebar() {
  const [init, action] = useRizkiContext();
  const { toggleSidebar, closeSidebar, darkMode } = init;

  const toggleDrawer = () => {
    setToggleSidebar(action, !toggleSidebar);
    setCloseSidebar(action, false);
  };
  const closeDrawer = () => {
    setToggleSidebar(action, !toggleSidebar);
    setCloseSidebar(action, true);
  };

  return (
    <>
      <AppBar position="fixed" open={toggleSidebar} close={closeSidebar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: "10px" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            PPID Bawaslu RI
          </Typography>
          <IconButton onClick={() => setDarkMode(action, !darkMode)}>
            <Brightness4OutlinedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={toggleSidebar}
        close={closeSidebar}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <List>Item 2</List>
        <List>Item 3</List>

        <Box component="div" sx={{ flexGrow: 1 }} />
        <Button onClick={closeDrawer}>
          <ArrowBackIosNewOutlinedIcon />
        </Button>
      </Drawer>
    </>
  );
}

export default Sidebar;
