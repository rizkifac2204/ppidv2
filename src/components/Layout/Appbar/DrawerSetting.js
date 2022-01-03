import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

import IconButton from "@mui/material/IconButton";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CircleIcon from "@mui/icons-material/Circle";

import { signOut } from "next-auth/react";
import Link from "next/link";

const sidenavColors = {
  info: "#0288d1",
  success: "#2e7d32",
  warning: "#ed6c02",
  error: "#d32f2f",
};

function DrawerSetting(props) {
  return (
    <Drawer
      variant="persistent"
      anchor={"right"}
      open={props.open}
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
          pt: 4,
          pb: 1,
          px: 3,
          borderRadius: "8px",
          boxShadow: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5">Pengaturan</Typography>
          <Typography variant="body2" color="text.secondary">
            Profile dan Tampilan
          </Typography>
        </Box>
        <Box>
          <CloseIcon
            sx={{ fontSize: 12, cursor: "pointer" }}
            onClick={props.toggleDrawerSetting}
          />
        </Box>
      </Box>

      <Divider />

      <Stack spacing={2} mt={3} mb={3}>
        <Link href="/admin/profile">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ManageAccountsIcon />}
          >
            Profile
          </Button>
        </Link>
        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={signOut}
        >
          Logout
        </Button>
      </Stack>

      <Divider />

      <Box
        sx={{
          mb: 3,
          mt: 3,
        }}
      >
        <Typography variant="subtitle1">Pengaturan</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <IconButton
              color="inherit"
              size="small"
              sx={{ color: "#0097a7" }}
              onClick={() => props.changePrimaryColor("#0097a7")}
            >
              <CircleIcon />
            </IconButton>
            {Object.keys(sidenavColors).map((key, idx) => (
              <IconButton
                key={idx}
                color={key}
                size="small"
                onClick={() => props.changePrimaryColor(sidenavColors[key])}
              >
                <CircleIcon />
              </IconButton>
            ))}
          </Box>
          <Box>
            <IconButton color="primary" onClick={() => props.changeMode()}>
              <SettingsBrightnessIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Divider />
    </Drawer>
  );
}

export default DrawerSetting;
