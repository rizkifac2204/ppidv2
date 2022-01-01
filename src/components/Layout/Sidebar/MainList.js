import { MenuItem } from "./ListItem";
import routes from "components/routes";

const MainList = () => {
  return routes.map((item) => <MenuItem key={item.title} item={item} />);
};

export default MainList;
