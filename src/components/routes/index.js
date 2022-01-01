import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarBorder from "@mui/icons-material/StarBorder";

const routes = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <DashboardIcon />,
  },
  {
    path: "/admin/two",
    title: "Halaman 2",
    icon: <ShoppingCartIcon />,
    children: [
      {
        path: "/admin/two",
        title: "sub 1",
        icon: <StarBorder />,
      },
      {
        path: "/admin/two",
        title: "sub 2",
        icon: <StarBorder />,
      },
    ],
  },
];

export default routes;
