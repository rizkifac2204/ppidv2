import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import PanToolIcon from "@mui/icons-material/PanTool";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import PeopleIcon from "@mui/icons-material/People";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import BarChartIcon from "@mui/icons-material/BarChart";
import DataArrayIcon from "@mui/icons-material/DataArray";
import AddIcon from "@mui/icons-material/Add";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import WifiIcon from "@mui/icons-material/Wifi";
import SignalWifiConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiConnectedNoInternet4";

export const mainRoutes = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon />,
  },
  {
    title: "Permohonan",
    icon: <AutoAwesomeMotionIcon />,
    children: [
      {
        title: "Online",
        path: "/admin/permohonan/online",
        icon: <WifiIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "Offline",
        icon: <SignalWifiConnectedNoInternet4Icon sx={{ fontSize: 12 }} />,
        children: [
          {
            title: "Data",
            path: "/admin/permohonan/offline",
            icon: <DataArrayIcon sx={{ fontSize: 12 }} />,
          },
          {
            title: "Tambah",
            path: "/admin/permohonan/offline/add",
            icon: <AddIcon sx={{ fontSize: 12 }} />,
          },
        ],
      },
    ],
  },
  {
    title: "Survey",
    icon: <AnalyticsIcon />,
    children: [
      {
        title: "Data",
        path: "/admin/survey",
        icon: <DataArrayIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "Chart",
        path: "/admin/survey/chart",
        icon: <BubbleChartIcon sx={{ fontSize: 12 }} />,
      },
    ],
  },
  {
    title: "Keberatan",
    path: "/admin/keberatan",
    icon: <PanToolIcon />,
  },
  {
    title: "Subscriber",
    icon: <ConnectWithoutContactIcon />,
    children: [
      {
        title: "Data Subscriber",
        path: "/admin/subscriber",
        icon: <ArrowRightIcon />,
      },
      {
        title: "Email",
        path: "/admin/subscriber/email",
        icon: <ArrowRightIcon />,
      },
    ],
  },
];

export const settingRoutes = [
  {
    title: "Users",
    icon: <PeopleIcon />,
    children: [
      {
        title: "Data",
        path: "/admin/setting/users",
        icon: <DataArrayIcon sx={{ fontSize: 12 }} />,
      },
      {
        title: "Tambah",
        path: "/admin/setting/users/add",
        icon: <AddIcon sx={{ fontSize: 12 }} />,
      },
    ],
  },
  {
    title: "Wilayah",
    path: "/admin/setting/wilayah",
    icon: <HomeWorkIcon />,
  },
  {
    title: "Sampah",
    path: "/admin/setting/trash",
    icon: <AutoDeleteIcon />,
  },
];

export const chartRoutes = [
  {
    title: "Layanan",
    path: "/admin/chart/layanan",
    icon: <BarChartIcon />,
  },
  {
    title: "Unit",
    path: "/admin/chart/unit",
    icon: <BarChartIcon />,
  },
];
