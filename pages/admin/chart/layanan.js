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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Layanan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    tahun: "",
    unit: "",
    prov: "",
    kab: "",
  });
  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);

  const fetchProv = () => {
    if (provinsis.length !== 0) return;
    axios
      .get(`/api/services/provinsis`)
      .then((res) => {
        setProvinsis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchKabkota = (id_prov) => {
    setKabkotas([]);
    if (!id_prov) return;
    axios
      .get(`/api/services/provinsis/` + id_prov)
      .then((res) => {
        setKabkotas(res.data.kabkota);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [tab, setTab] = useState(0);
  const handleTab = (event, newValue) => {
    setData([]);
    setTab((prev) => newValue);
  };

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    const prepareFilter = { ...filter, [name]: value };
    if (name === "unit") {
      prepareFilter = { ...prepareFilter, kab: "", prov: "" };
    }
    if (name === "prov") {
      prepareFilter = { ...prepareFilter, kab: "" };
    }
    setFilter((prev) => prepareFilter);
  };

  useEffect(() => {
    function fetchingData(tab = 0) {
      setLoading(true);
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
        jenis = "platform";
      }
      axios
        .get(`/api/chart/layanan?chart=${jenis}`, {
          params: filter,
        })
        .then((res) => {
          setData((prevData) => res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        })
        .then(() => {
          setLoading(false);
        });
    }
    fetchingData(tab);
  }, [tab, filter]);

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="primary" gutterBottom>
            Grafik Ringkasan Layanan <b>Permohonan</b>
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
              <Tab label="Platform" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <WaitLoadingComponent loading={loading} />
          <TabPanel value={tab} index={0}>
            <CustomAreaChart data={data} loading={loading} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CustomWordCloud data={data} loading={loading} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <CustomPieChart data={data} loading={loading} />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <CustomPieChart data={data} loading={loading} />
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
                    value={filter.tahun}
                    onChange={handleChangeFilter}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Unit</InputLabel>
                  <Select
                    name="unit"
                    label="Unit"
                    value={filter.unit}
                    onChange={(e) => {
                      handleChangeFilter(e);
                      if (e.target.value === "2" || e.target.value === "3") {
                        fetchProv();
                      }
                    }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    <MenuItem value="1">Bawaslu RI</MenuItem>
                    <MenuItem value="2">Bawaslu/Provinsi</MenuItem>
                    <MenuItem value="3">Bawaslu Kabupaten/Kota</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Provinsi</InputLabel>
                  <Select
                    name="prov"
                    label="Provinsi"
                    value={filter.prov}
                    onChange={(e) => {
                      handleChangeFilter(e);
                      fetchKabkota(e.target.value);
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
                    value={filter.kab}
                    onChange={handleChangeFilter}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {kabkotas.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.kabkota}
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
