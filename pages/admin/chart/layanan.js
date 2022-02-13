import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import {
  CustomPieChart,
  CustomAreaChart,
  CustomWordCloud,
} from "components/CustomChart";

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
function TabPanelOff({ children, value, index, ...other }) {
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
function a11yPropsOff(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Layanan() {
  const [dataOnline, setDataOnline] = useState([]);
  const [dataOffline, setDataOffline] = useState([]);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [loadingOffline, setLoadingOffline] = useState(false);
  const [filterOnline, setFilterOnline] = useState({
    tahun: "",
    unit: "",
    prov: "",
    kab: "",
  });
  const [filterOffline, setFilterOffline] = useState({
    tahun: "",
    unit: "",
    prov: "",
    kab: "",
  });
  const [provinsis, setProvinsis] = useState([]);
  const [kabkots, setKabkots] = useState([]);
  // dibuat dua untuk offline
  const [kabkotsOffline, setKabkotsOffline] = useState([]);

  const fetchProv = () => {
    if (provinsis.length !== 0) return;
    axios
      .get(`/api/setting/wilayah/provinsis`)
      .then((res) => {
        setProvinsis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchKabkot = (id_prov, param) => {
    if (param === "online") {
      setKabkots([]);
    } else {
      setKabkotsOffline([]);
    }
    if (!id_prov) return;
    axios
      .get(`/api/setting/wilayah/provinsis/` + id_prov)
      .then((res) => {
        if (param === "online") {
          setKabkots(res.data.kabkot);
        } else {
          setKabkotsOffline(res.data.kabkot);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [tab, setTab] = useState(0);
  const handleTab = (event, newValue) => {
    setDataOnline([]);
    setTab((prev) => newValue);
  };
  const [tabOffline, setTabOffline] = useState(0);
  const handleTabOffline = (event, newValue) => {
    setDataOffline([]);
    setTabOffline((prev) => newValue);
  };

  const handleChangeFilterOnline = (event) => {
    const { name, value } = event.target;
    const prepareFilter = { ...filterOnline, [name]: value };
    if (name === "unit") {
      prepareFilter = { ...prepareFilter, kab: "", prov: "" };
    }
    if (name === "prov") {
      prepareFilter = { ...prepareFilter, kab: "" };
    }
    setFilterOnline((prev) => prepareFilter);
  };

  const handleChangeFilterOffline = (event) => {
    const { name, value } = event.target;
    const prepareFilter = { ...filterOffline, [name]: value };
    if (name === "unit") {
      prepareFilter = { ...prepareFilter, kab: "", prov: "" };
    }
    if (name === "prov") {
      prepareFilter = { ...prepareFilter, kab: "" };
    }
    setFilterOffline((prev) => prepareFilter);
  };

  useEffect(() => {
    function fetchingDataOnline(tab = 0) {
      setLoadingOnline(true);
      var jenis;
      if (tab === 0) {
        jenis = "jumlahpermohonan";
      }
      if (tab === 1) {
        jenis = "latarbelakang";
      }
      if (tab === 2) {
        jenis = "status";
      }
      if (tab === 3) {
        jenis = "alasan";
      }
      axios
        .get(`/api/chart/layanan-online?chart=${jenis}`, {
          params: filterOnline,
        })
        .then((res) => {
          setDataOnline((prevData) => res.data);
          // console.log(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        })
        .then(() => {
          setLoadingOnline(false);
        });
    }
    fetchingDataOnline(tab);
  }, [tab, filterOnline]);

  useEffect(() => {
    function fetchingDataOffline(tab = 0) {
      setLoadingOffline(true);
      var jenisoffline;
      if (tab === 0) {
        jenisoffline = "jumlahpermohonan";
      }
      if (tab === 1) {
        jenisoffline = "latarbelakang";
      }
      if (tab === 2) {
        jenisoffline = "status";
      }
      if (tab === 3) {
        jenisoffline = "alasan";
      }
      axios
        .get(`/api/chart/layanan-offline?chart=${jenisoffline}`, {
          params: filterOffline,
        })
        .then((res) => {
          setDataOffline((prevData) => res.data);
          // console.log(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        })
        .then(() => {
          setLoadingOffline(false);
        });
    }
    fetchingDataOffline(tabOffline);
  }, [tabOffline, filterOffline]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="primary" gutterBottom>
            Grafik Ringkasan Layanan <b>Permohonan Online</b>
          </Typography>
          <Box>
            <Tabs
              value={tab}
              onChange={handleTab}
              aria-label="Tabs Chart"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Jumlah Permohonan" {...a11yProps(0)} />
              <Tab label="Latar Belakang Pemohon" {...a11yProps(1)} />
              <Tab label="Status Permohonan" {...a11yProps(2)} />
              <Tab label="Alasan Penolakan" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <WaitLoadingComponent loading={loadingOnline} />
          <TabPanel value={tab} index={0}>
            <CustomAreaChart data={dataOnline} loading={loadingOnline} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CustomWordCloud data={dataOnline} loading={loadingOnline} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <CustomPieChart data={dataOnline} loading={loadingOnline} />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <CustomPieChart data={dataOnline} loading={loadingOnline} />
          </TabPanel>
        </CardContent>
        <CardActions>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Box>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Tahun</InputLabel>
                  <Select
                    name="tahun"
                    label="Tahun"
                    value={filterOnline.tahun}
                    onChange={handleChangeFilterOnline}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    label="Unit"
                    value={filterOnline.unit}
                    onChange={(e) => {
                      handleChangeFilterOnline(e);
                      if (
                        e.target.value === "Bawaslu Provinsi" ||
                        e.target.value === "Bawaslu"
                      ) {
                        fetchProv();
                      }
                    }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="Bawaslu Republik Indonesia">
                      Bawaslu RI
                    </MenuItem>
                    <MenuItem value="Bawaslu Provinsi">
                      Bawaslu/Provinsi
                    </MenuItem>
                    <MenuItem value="Bawaslu">Bawaslu Kabupaten/Kota</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Provinsi</InputLabel>
                  <Select
                    name="prov"
                    label="Provinsi"
                    value={filterOnline.prov}
                    onChange={(e) => {
                      handleChangeFilterOnline(e);
                      fetchKabkot(e.target.value, "online");
                    }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {provinsis.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.provinsi}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Kabupaten/Kota</InputLabel>
                  <Select
                    name="kab"
                    label="Kabupaten/Kota"
                    value={filterOnline.kab}
                    onChange={handleChangeFilterOnline}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {kabkots.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.kabupaten}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </CardActions>
      </Card>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="secondary" gutterBottom>
            Grafik Ringkasan Layanan <b>Permohonan Offline</b>
          </Typography>
          <Box>
            <Tabs
              value={tabOffline}
              onChange={handleTabOffline}
              aria-label="Tabs Chart"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Jumlah Permohonan" {...a11yPropsOff(0)} />
              <Tab label="Latar Belakang Pemohon" {...a11yPropsOff(1)} />
              <Tab label="Status Permohonan" {...a11yPropsOff(2)} />
              <Tab label="Alasan Penolakan" {...a11yPropsOff(3)} />
            </Tabs>
          </Box>
          <WaitLoadingComponent loading={loadingOffline} />
          <TabPanelOff value={tabOffline} index={0}>
            <CustomAreaChart data={dataOffline} loading={loadingOffline} />
          </TabPanelOff>
          <TabPanelOff value={tabOffline} index={1}>
            <CustomWordCloud data={dataOffline} loading={loadingOffline} />
          </TabPanelOff>
          <TabPanelOff value={tabOffline} index={2}>
            <CustomPieChart data={dataOffline} loading={loadingOffline} />
          </TabPanelOff>
          <TabPanelOff value={tabOffline} index={3}>
            <CustomPieChart data={dataOffline} loading={loadingOffline} />
          </TabPanelOff>
        </CardContent>
        <CardActions>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Box>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Tahun</InputLabel>
                  <Select
                    name="tahun"
                    label="Tahun"
                    value={filterOffline.tahun}
                    onChange={handleChangeFilterOffline}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    label="Unit"
                    value={filterOffline.unit}
                    onChange={(e) => {
                      handleChangeFilterOffline(e);
                      if (
                        e.target.value === "Bawaslu Provinsi" ||
                        e.target.value === "Bawaslu"
                      ) {
                        fetchProv();
                      }
                    }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="Bawaslu Republik Indonesia">
                      Bawaslu RI
                    </MenuItem>
                    <MenuItem value="Bawaslu Provinsi">
                      Bawaslu/Provinsi
                    </MenuItem>
                    <MenuItem value="Bawaslu">Bawaslu Kabupaten/Kota</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Provinsi</InputLabel>
                  <Select
                    name="prov"
                    label="Provinsi"
                    value={filterOffline.prov}
                    onChange={(e) => {
                      handleChangeFilterOffline(e);
                      fetchKabkot(e.target.value, "offline");
                    }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {provinsis.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.provinsi}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Kabupaten/Kota</InputLabel>
                  <Select
                    name="kab"
                    label="Kabupaten/Kota"
                    value={filterOffline.kab}
                    onChange={handleChangeFilterOffline}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {kabkotsOffline.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.kabupaten}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </>
  );
}

Layanan.auth = true;
Layanan.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/chart/layanan",
    title: "Chart Layanan",
  },
];
export default Layanan;
