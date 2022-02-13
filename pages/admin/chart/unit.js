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
import { CustomBarChart } from "components/CustomChart";

const example = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

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

function Unit() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    tahun: "",
    unit: "",
    prov: "",
  });

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
  const [tab, setTab] = useState(0);
  const [provinsis, setProvinsis] = useState([]);
  const handleTab = (event, newValue) => {
    setData([]);
    setTab((prev) => newValue);
  };
  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    const prepareFilter = { ...filter, [name]: value };
    if (name === "unit") {
      prepareFilter = { ...prepareFilter, prov: "" };
    }
    setFilter((prev) => prepareFilter);
  };

  useEffect(() => {
    setLoading(true);
    function fetchingData(tab = 0) {
      const jenis = tab === 0 ? "online" : "offline";
      if (filter.unit === "Bawaslu" && !filter.prov) return;
      axios
        .get(`/api/chart/unit?chart=${jenis}`, { params: filter })
        .then((res) => {
          setData((prevData) => res.data);
          // console.log(res.data);
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
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="primary" gutterBottom>
          Grafik Ringkasan Jumlah Permohonan <b>Per Unit</b>
        </Typography>
        <Box>
          <Tabs
            value={tab}
            onChange={handleTab}
            aria-label="Tabs Chart"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Permohonan Online" {...a11yProps(0)} />
            <Tab label="Permohonan Offline" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <WaitLoadingComponent loading={loading} />
        <TabPanel value={tab} index={0}>
          <CustomBarChart data={data} loading={loading} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <CustomBarChart data={data} loading={loading} />
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
                    if (e.target.value === "Bawaslu") {
                      fetchProv();
                    }
                  }}
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="Bawaslu Provinsi">Bawaslu/Provinsi</MenuItem>
                  <MenuItem value="Bawaslu">Bawaslu Kabupaten/Kota</MenuItem>
                </Select>
              </FormControl>
              {filter.unit === "Bawaslu" && (
                <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }} size="small">
                  <InputLabel>Provinsi</InputLabel>
                  <Select
                    name="prov"
                    label="Provinsi"
                    value={filter.prov}
                    onChange={handleChangeFilter}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {provinsis.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.provinsi}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

Unit.auth = true;
Unit.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/chart/unit",
    title: "Chart Unit",
  },
];
export default Unit;
