import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

//Component
import ProfileCard from "components/ProfileCard";
import ProfileForm from "components/ProfileForm";
import ProfilePassword from "components/ProfilePassword";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState({});

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!session) return;
    function fetchProfile() {
      axios
        .get("/api/profile")
        .then((res) => {
          const merged = { ...res.data, ...session.user };
          setProfile(merged);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data);
        });
    }
    fetchProfile();
  }, [session]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={3}>
        <ProfileCard profile={profile} />
      </Grid>
      <Grid item xs={12} md={9}>
        {/*  */}

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Pengaturan Profile"
          >
            <Tab label="Ganti Data Profile" {...a11yProps(0)} />
            <Tab label="Ganti Password" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ProfileForm profile={profile} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ProfilePassword profile={profile} />
        </TabPanel>
      </Grid>
    </Grid>
  );
}

Profile.auth = true;
Profile.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/profile",
    title: "Profile",
  },
];
export default Profile;
