import { useEffect, useState, useContext } from "react";
import AuthContext from "context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import ProfileCard from "components/Userprofile/ProfileCard";
import ProfileForm from "components/Userprofile/ProfileForm";
import ProfilePassword from "components/Userprofile/ProfilePassword";

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
  const { user: session } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    function fetchProfile() {
      axios
        .get("/api/profile")
        .then((res) => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data);
        })
        .then(() => setLoading(false));
    }
    fetchProfile();
  }, [session]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={3}>
        <WaitLoadingComponent loading={loading} />
        <ProfileCard profile={profile} />
      </Grid>
      <Grid item xs={12} md={9}>
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
          <WaitLoadingComponent loading={loading} />
          {!loading && (
            <ProfileForm profile={profile} setProfile={setProfile} />
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WaitLoadingComponent loading={loading} />
          {!loading && <ProfilePassword profile={profile} />}
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
