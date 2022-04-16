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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import { CustomBarChart } from "components/CustomChart";

function Unit() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provinsis, setProvinsis] = useState([]);
  const [filter, setFilter] = useState({
    tahun: "",
    unit: "",
    prov: "",
  });

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
    function fetchingData() {
      if (filter.unit === "3" && !filter.prov) return;
      axios
        .get(`/api/chart/unit`, { params: filter })
        .then((res) => {
          setData((prevData) => res.data);
          console.log(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        })
        .then(() => {
          setLoading(false);
        });
    }
    fetchingData();
  }, [filter]);

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="primary" gutterBottom>
          Grafik Ringkasan Jumlah Permohonan <b>Per Unit</b>
        </Typography>
        <WaitLoadingComponent loading={loading} />
        <CustomBarChart data={data} loading={loading} />
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
                    if (e.target.value === "3") {
                      fetchProv();
                    }
                  }}
                >
                  <MenuItem value="">Semua</MenuItem>
                  <MenuItem value="2">Bawaslu/Provinsi</MenuItem>
                  <MenuItem value="3">Bawaslu Kabupaten/Kota</MenuItem>
                </Select>
              </FormControl>
              {filter.unit === "3" && (
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
