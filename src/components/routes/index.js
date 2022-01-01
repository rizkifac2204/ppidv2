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
        icon: <ArrowRightIcon />,
      },
      {
        title: "Offline",
        icon: <ArrowRightIcon />,
        children: [
          {
            title: "Data",
            path: "/admin/permohonan/offline",
            icon: null,
          },
          {
            title: "Tambah",
            path: "/admin/permohonan/offline/add",
            icon: null,
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
        icon: <ArrowRightIcon />,
      },
      {
        title: "Chart",
        path: "/admin/survey/chart",
        icon: <ArrowRightIcon />,
      },
    ],
  },
  {
    title: "Keberatan",
    path: "/admin/keberatan",
    icon: <PanToolIcon />,
  },
  {
    title: "Sahabat",
    icon: <ConnectWithoutContactIcon />,
    children: [
      {
        title: "Subscriber",
        path: "/admin/sahabat/subsrciber",
        icon: <ArrowRightIcon />,
      },
      {
        title: "Buat Email",
        path: "/admin/sahabat/email",
        icon: <ArrowRightIcon />,
      },
      {
        title: "Draft",
        path: "/admin/sahabat/draft",
        icon: <ArrowRightIcon />,
      },
      {
        title: "Terkirim",
        path: "/admin/sahabat/send",
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
        icon: <ArrowRightIcon />,
      },
      {
        title: "Tambah",
        path: "/admin/setting/users/add",
        icon: <ArrowRightIcon />,
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
