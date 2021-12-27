import MuiDrawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import {
  useRizkiContext,
  setToggleSidebar,
  setCloseSidebar,
  drawerWidth,
} from "context";
import Link from "next/link";
import Image from "next/image";

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
  [theme.breakpoints.down("md")]: {
    width: 0,
  },
  [theme.breakpoints.up("md")]: {
    width: close ? 0 : `calc(${theme.spacing(9)} + 1px)`,
  },
});

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

  const closeDrawer = () => {
    setToggleSidebar(action, !toggleSidebar);
    setCloseSidebar(action, true);
  };

  return (
    <Drawer variant="permanent" open={toggleSidebar} close={closeSidebar}>
      <Toolbar>
        {toggleSidebar ? (
          darkMode ? (
            <Image src="/images/logo-white.png" alt="Logo" layout="fill" />
          ) : (
            <Image src="/images/logo-dark.png" alt="Logo" layout="fill" />
          )
        ) : (
          <Image src="/images/logo.png" alt="Logo" layout="fill" />
        )}
      </Toolbar>

      <List>
        <Link href="/admin">
          <a>Dashboard</a>
        </Link>
      </List>
      <List>
        <Link href="/admin/one">
          <a>One</a>
        </Link>
      </List>
      <List>
        <Link href="/admin/two">
          <a>Two</a>
        </Link>
      </List>
      <List>Item 3</List>

      <Box component="div" sx={{ flexGrow: 1 }} />
      <Button onClick={closeDrawer}>
        <ArrowBackIosNewOutlinedIcon />
      </Button>
    </Drawer>
  );
}

export default Sidebar;
