import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import Skeleton from "@mui/material/Skeleton";

function TopRight({ toggleDrawerSetting }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Skeleton variant="circular" width={40} height={40} />;
  const { image, name: alt } = user;
  return (
    <>
      <IconButton onClick={() => toggleDrawerSetting()}>
        <Badge
          badgeContent={<SettingsIcon sx={{ fontSize: 14 }} />}
          color="primary"
        >
          <Avatar
            sx={{ backgroundColor: "primary.light", width: 28, height: 28 }}
            alt={alt}
            src={image}
          />
        </Badge>
      </IconButton>
    </>
  );
}

export default TopRight;
