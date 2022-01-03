import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";

function TopRight({ toggleDrawerSetting }) {
  return (
    <>
      <IconButton onClick={() => toggleDrawerSetting()}>
        <Badge
          badgeContent={<SettingsIcon sx={{ fontSize: 14 }} />}
          color="primary"
        >
          <Avatar
            sx={{ backgroundColor: "primary.light", width: 28, height: 28 }}
            alt="Rizki"
            src="."
          />
        </Badge>
      </IconButton>
    </>
  );
}

export default TopRight;
