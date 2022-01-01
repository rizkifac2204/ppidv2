import MuiDrawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
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
import { MainList, SettingList, ChartList } from "./MainList";

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
  "& .MuiDrawer-paper": {},
  position: "relative",
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

const LogoContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  position: "relative",
  margin: 10,
  ...(open && {
    width: 160,
    height: 50,
  }),
  ...(!open && {
    width: 50,
    height: 50,
    marginLeft: 10,
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
      <Box>
        <Link href={"/admin"}>
          <a>
            <LogoContainer open={toggleSidebar}>
              {toggleSidebar ? (
                darkMode ? (
                  <Image
                    src="/images/logo-white.png"
                    alt="Logo"
                    layout="fill"
                    priority
                  />
                ) : (
                  <Image
                    src="/images/logo-dark.png"
                    alt="Logo"
                    layout="fill"
                    priority
                  />
                )
              ) : (
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  layout="fill"
                  className="logoSmall"
                />
              )}
            </LogoContainer>
          </a>
        </Link>
      </Box>

      <List>
        <MainList />
      </List>

      <Divider />

      <List>
        <SettingList />
      </List>

      <Divider />

      <List>
        <ChartList />
      </List>

      <Box component="div" sx={{ flexGrow: 1 }} />
      <Button onClick={closeDrawer}>
        <ArrowBackIosNewOutlinedIcon />
      </Button>
    </Drawer>
  );
}

export default Sidebar;
