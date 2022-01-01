import { useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";

export const SingleLevel = ({ item }) => {
  return (
    <Link href={item.path}>
      <ListItem button>
        <Tooltip title={item.title} placement="right">
          <ListItemIcon>{item.icon}</ListItemIcon>
        </Tooltip>
        <ListItemText primary={item.title} />
      </ListItem>
    </Link>
  );
};

export const MultiLevel = ({ item }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <ListItem button onClick={handleClick}>
        <Tooltip title={item.title} placement="right">
          <ListItemIcon>{item.icon}</ListItemIcon>
        </Tooltip>
        <ListItemText primary={item.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((child, key) => (
            <Box key={key} sx={{ paddingLeft: 1, paddingY: 0 }}>
              <MenuItem item={child} />
            </Box>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export const MenuItem = ({ item }) => {
  const Component = item.children ? MultiLevel : SingleLevel;
  return <Component item={item} />;
};
