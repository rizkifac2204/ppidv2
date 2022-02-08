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
// Rechartsjs
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// PR
// BUAT LOADING JIKA MEMUDAT CHART ATAU MEMUAT ULANG
// TAMBAHKAN FILTER UNIT DAN PROVINSI JIKA YANG DILIHAT UNIT PROVINSI
// SAMPAI KABUPATEN
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const ChartArea = ({ item }) => {
  if (!item) return;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width={600} height={600}>
        <Pie
          dataKey="value"
          startAngle={360}
          endAngle={0}
          data={item.chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(i) => {
            return `(${i.value}) ${i.name}`;
          }}
        >
          {item.chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
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
  const [quest, setQuest] = useState(INITQUEST);
  const [filter, setFilter] = useState({
    tahun: "",
    lain: "",
  });

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    setFilter((prev) => ({ ...filter, [name]: value }));
  };

  function fetchingData() {
    axios
      .get(`/api/surveys`, { params: filter })
      .then((res) => {
        setData((prevData) => res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }

  useEffect(() => {
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
    setQuest((prevValue) => tempData);
  }, [data]);

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography>Filter</Typography>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Tahun *</InputLabel>
              <Select
                name="tahun"
                label="Tahun *"
                value={filter.tahun}
                onChange={handleChangeFilter}
              >
                <MenuItem value="">Semua</MenuItem>
                <MenuItem value="2020">2020</MenuItem>
                <MenuItem value="2021">2021</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
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
                <ChartArea item={item} />
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
