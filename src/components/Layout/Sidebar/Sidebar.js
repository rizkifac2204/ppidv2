// NEXT
import Link from "next/link";
import Image from "next/image";
// SCHROLL
import PerfectScrollbar from "react-perfect-scrollbar";
// MUI
import MuiDrawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
// LIST
import { MainList, DipList, SettingList, ChartList } from "./MainList";

const openedMixin = (theme, close, drawerWidth) => ({
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
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "close" && prop !== "drawerWidth",
})(({ theme, open, close, drawerWidth }) => ({
  // "& .MuiDrawer-paper": {},
  position: "relative",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme, close, drawerWidth),
    "& .MuiDrawer-paper": openedMixin(theme, close, drawerWidth),
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

function Sidebar(props) {
  return (
    <Drawer
      variant="permanent"
      open={props.toggleSidebar}
      close={props.closeSidebar}
      drawerWidth={props.drawerWidth}
      onClose={props.closeDrawer}
    >
      <Box>
        <Link href={"/admin"}>
          <a>
            <LogoContainer open={props.toggleSidebar}>
              {props.toggleSidebar ? (
                props.darkMode ? (
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

      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Box sx={{ position: "relative" }}>
          <List
            component="nav"
            aria-labelledby="subheaderGeneral"
            subheader={
              <ListSubheader component="div" id="subheaderGeneral">
                Permohonan
              </ListSubheader>
            }
          >
            <MainList />
          </List>
          <Divider />
          <List
            component="nav"
            aria-labelledby="subheaderDip"
            subheader={
              <ListSubheader component="div" id="subheaderDiv">
                DIP
              </ListSubheader>
            }
          >
            <DipList />
          </List>
          <Divider />
          <List
            component="nav"
            aria-labelledby="subheaderSetting"
            subheader={
              <ListSubheader component="div" id="subheaderSetting">
                Setting
              </ListSubheader>
            }
          >
            <SettingList />
          </List>
          <Divider />
          <List
            component="nav"
            aria-labelledby="subheaderChart"
            subheader={
              <ListSubheader component="div" id="subheaderChart">
                Chart
              </ListSubheader>
            }
          >
            <ChartList />
          </List>
        </Box>
      </PerfectScrollbar>

      <Box component="div" sx={{ flexGrow: 1 }} />
      <Button onClick={props.closeDrawer}>
        <ArrowBackIosNewOutlinedIcon />
      </Button>
    </Drawer>
  );
}

export default Sidebar;
