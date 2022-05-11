import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CardActions from "@mui/material/CardActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
// ICON
import PeopleIcon from "@mui/icons-material/People";
import PanToolIcon from "@mui/icons-material/PanTool";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import WifiIcon from "@mui/icons-material/Wifi";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import DataSaverOnIcon from "@mui/icons-material/DataSaverOn";

// Components
import {
  DashboardCollapse,
  TableBelumRespon,
} from "components/Dashboard/DashboardComponent";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Index() {
  const [main, setMain] = useState({});
  const [status, setStatus] = useState({});
  const [unresponse, setUnresponse] = useState({});

  const [expandedOnline, setExpandedOnline] = useState(false);
  const [expandedOffline, setExpandedOffline] = useState(false);

  const handleExpandOnlineClick = () => {
    setExpandedOnline(!expandedOnline);
  };
  const handleExpandOfflineClick = () => {
    setExpandedOffline(!expandedOffline);
  };

  useEffect(() => {
    function getMain() {
      axios
        .get(`api/dashboard/main`)
        .then((res) => {
          setMain(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Terjadi Kesalahan");
        });
    }
    getMain();
  }, []);

  useEffect(() => {
    function getStatus() {
      axios
        .get(`api/dashboard/status`)
        .then((res) => {
          setStatus(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Terjadi Kesalahan");
        });
    }
    getStatus();
  }, []);

  useEffect(() => {
    function getBelumRespon() {
      axios
        .get(`api/dashboard/belumRespon`)
        .then((res) => {
          setUnresponse(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Terjadi Kesalahan");
        });
    }
    getBelumRespon();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <CardContent>
              <Typography component="div" variant="h5">
                {main.jumlahUser}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Pengguna
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/admin/setting/users">
                <a>
                  <SettingsSuggestIcon
                    color="secondary"
                    sx={{ cursor: "pointer" }}
                  />
                </a>
              </Link>
            </CardActions>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <PeopleIcon color="info" sx={{ fontSize: 120 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <CardContent>
              <Typography component="div" variant="h5">
                {main.jumlahDip}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                DIP
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/admin/dip">
                <a>
                  <SettingsSuggestIcon
                    color="secondary"
                    sx={{ cursor: "pointer" }}
                  />
                </a>
              </Link>
            </CardActions>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <DataSaverOnIcon color="primary" sx={{ fontSize: 120 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <CardContent>
              <Typography component="div" variant="h5">
                {main.jumlahSurvey}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Survey
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/admin/survey">
                <a>
                  <SettingsSuggestIcon
                    color="secondary"
                    sx={{ cursor: "pointer" }}
                  />
                </a>
              </Link>
            </CardActions>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <DynamicFormIcon color="warning" sx={{ fontSize: 120 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <CardContent>
              <Typography component="div" variant="h5">
                {main.jumlahKeberatan}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Keberatan
              </Typography>
            </CardContent>
            <CardActions>
              <Link href="/admin/keberatan">
                <a>
                  <SettingsSuggestIcon
                    color="secondary"
                    sx={{ cursor: "pointer" }}
                  />
                </a>
              </Link>
            </CardActions>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <PanToolIcon color="error" sx={{ fontSize: 120 }} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box>
            <CardContent>
              <Typography component="div" variant="h5">
                {main.jumlahPermohonan}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Permohonan
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Link href="/admin/permohonan">
                <a>
                  <SettingsSuggestIcon
                    color="secondary"
                    sx={{ cursor: "pointer" }}
                  />
                </a>
              </Link>
              <ExpandMore
                expand={expandedOnline}
                onClick={handleExpandOnlineClick}
                aria-expanded={expandedOnline}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <WifiIcon color="success" sx={{ fontSize: 120 }} />
          </Box>
        </Card>
        <DashboardCollapse
          expanded={expandedOnline}
          arr={status.result}
          jumlah={main.jumlahPermohonan}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Bawaslu Dengan Jumlah Permohonan Proses Terbanyak
            </Typography>
            <TableBelumRespon arr={unresponse} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

Index.auth = true;
Index.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
];
export default Index;
