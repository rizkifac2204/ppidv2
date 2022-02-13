import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import { CustomPieChart } from "components/CustomChart";

const INITQUEST = [
  {
    no: 1,
    chartData: [],
    bil: "satu",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KESESUAIAN PERSYARATAN PERMOHONAN INFORMASI PUBLIK DENGAN JENIS PELAYANANNYA?",
  },
  {
    no: 2,
    chartData: [],
    bil: "dua",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KEMUDAHAN PROSEDUR PELAYANAN PERMOHONAN INFORMASI PUBLIK DI BAWASLU?",
  },
  {
    no: 3,
    chartData: [],
    bil: "tiga",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KECEPATAN WAKTU PETUGAS DALAM MEMBERIKAN PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 4,
    chartData: [],
    bil: "empat",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KEWAJARAN BIAYA/TARIF DALAM PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 5,
    chartData: [],
    bil: "lima",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KESESUAIAN PRODUK PELAYANAN ANTARA YANG TERCANTUM DALAM STANDAR PELAYANAN DENGAN HASIL YANG DIBERIKAN?",
  },
  {
    no: 6,
    chartData: [],
    bil: "enam",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KOMPETENSI/KEMAMPUAN PETUGAS DALAM PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 7,
    chartData: [],
    bil: "tujuh",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG PERILAKU PETUGAS DALAM PELAYANAN INFORMASI PUBLIK TERKAIT KESOPANAN DAN KERAMAHAN?",
  },
  {
    no: 8,
    chartData: [],
    bil: "delapan",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KUALITAS SARANA DAN PRASARANA PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 9,
    chartData: [],
    bil: "sembilan",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG PENANGANAN PENGADUAN PENGGUNA LAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 10,
    chartData: [],
    bil: "sepuluh",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG TINGKAT KEPUASAN TERHADAP KESELURUHAN PELAYANAN INFORMASI PUBLIK DI BAWASLU?",
  },
];

function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}

function SurveyChart() {
  const [data, setData] = useState([]);
  const [provinsis, setProvinsis] = useState([]);
  const [kabkots, setKabkots] = useState([]);
  const [quest, setQuest] = useState(INITQUEST);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    tahun: "",
    unit: "",
    prov: "",
    kab: "",
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

  const fetchKabkot = (id_prov) => {
    setKabkots([]);
    if (!id_prov) return;
    axios
      .get(`/api/setting/wilayah/provinsis/` + id_prov)
      .then((res) => {
        setKabkots(res.data.kabkot);
      })
      .catch((err) => {
        console.log(err);
      });
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
    function fetchingData() {
      setLoading(true);
      axios
        .get(`/api/surveys/chart`, { params: filter })
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
    fetchingData();
  }, [filter]);

  useEffect(() => {
    // masalah disini
    const tempData = [...quest];
    for (var i = 0, len = quest.length; i < len; i++) {
      tempData[i].chartData = [];
      const eachData = groupByKey(data, tempData[i].bil);
      Object.keys(eachData).forEach((item, idx) => {
        tempData[i].chartData.push({
          name: item,
          value: eachData[Object.keys(eachData)[idx]].length,
        });
      });
    }
    setQuest(tempData);
  }, [data, quest]);

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>Filter</Typography>
          <Box>
            <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }}>
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
            <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }}>
              <InputLabel>Unit</InputLabel>
              <Select
                name="unit"
                label="Unit"
                value={filter.unit}
                onChange={(e) => {
                  handleChangeFilter(e);
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
                <MenuItem value="Bawaslu Provinsi">Bawaslu/Provinsi</MenuItem>
                <MenuItem value="Bawaslu">Bawaslu Kabupaten/Kota</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }}>
              <InputLabel>Provinsi</InputLabel>
              <Select
                name="prov"
                label="Provinsi"
                value={filter.prov}
                onChange={(e) => {
                  handleChangeFilter(e);
                  fetchKabkot(e.target.value);
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
            <FormControl sx={{ mx: 1, my: 1, minWidth: 180 }}>
              <InputLabel>Kabupaten/Kota</InputLabel>
              <Select
                name="kab"
                label="Kabupaten/Kota"
                value={filter.kab}
                onChange={handleChangeFilter}
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
        </CardContent>
      </Card>
      <Grid container spacing={2}>
        {quest.map((item) => (
          <Grid key={item.no} item md={6}>
            <Card>
              <CardContent>
                {item.no}. {item.quest}
                <WaitLoadingComponent loading={loading} />
                <CustomPieChart data={item.chartData} loading={loading} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

SurveyChart.auth = true;
SurveyChart.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/survey",
    title: "Survey",
  },
  {
    path: "/admin/survey/chart",
    title: "Chart",
  },
];
export default SurveyChart;
