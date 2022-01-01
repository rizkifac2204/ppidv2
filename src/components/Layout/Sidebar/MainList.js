import { MenuItem } from "./ListItem";
import { mainRoutes, settingRoutes, chartRoutes } from "components/routes";

export const MainList = () => {
  return mainRoutes.map((item) => <MenuItem key={item.title} item={item} />);
};

export const SettingList = () => {
  return settingRoutes.map((item) => <MenuItem key={item.title} item={item} />);
};

export const ChartList = () => {
  return chartRoutes.map((item) => <MenuItem key={item.title} item={item} />);
};
