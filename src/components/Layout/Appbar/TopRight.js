import { useSession } from "next-auth/react";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";

function TopRight({ toggleDrawerSetting }) {
  const { data: session } = useSession();
  const { image, name: alt } = session.user;
  return (
    <>
      <IconButton onClick={() => toggleDrawerSetting()}>
        <Badge
          badgeContent={<SettingsIcon sx={{ fontSize: 14 }} />}
          color="primary"
        >
          {session.user && (
            <Avatar
              sx={{ backgroundColor: "primary.light", width: 28, height: 28 }}
              alt={alt}
              src={image}
            />
          )}
        </Badge>
      </IconButton>
    </>
  );
}

export default TopRight;
