import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
// Rechartsjs
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const example = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const quest = [
  {
    no: 1,
    bil: "satu",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KESESUAIAN PERSYARATAN PERMOHONAN INFORMASI PUBLIK DENGAN JENIS PELAYANANNYA?",
  },
  {
    no: 2,
    bil: "dua",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KEMUDAHAN PROSEDUR PELAYANAN PERMOHONAN INFORMASI PUBLIK DI BAWASLU?",
  },
  {
    no: 3,
    bil: "tiga",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KECEPATAN WAKTU PETUGAS DALAM MEMBERIKAN PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 4,
    bil: "empat",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KEWAJARAN BIAYA/TARIF DALAM PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 5,
    bil: "lima",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KESESUAIAN PRODUK PELAYANAN ANTARA YANG TERCANTUM DALAM STANDAR PELAYANAN DENGAN HASIL YANG DIBERIKAN?",
  },
  {
    no: 6,
    bil: "enam",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KOMPETENSI/KEMAMPUAN PETUGAS DALAM PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 7,
    bil: "tujuh",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG PERILAKU PETUGAS DALAM PELAYANAN INFORMASI PUBLIK TERKAIT KESOPANAN DAN KERAMAHAN?",
  },
  {
    no: 8,
    bil: "delapan",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG KUALITAS SARANA DAN PRASARANA PELAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 9,
    bil: "sembilan",
    quest:
      "BAGAIMANA PENDAPAT SAUDARA TENTANG PENANGANAN PENGADUAN PENGGUNA LAYANAN INFORMASI PUBLIK?",
  },
  {
    no: 10,
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
  useEffect(() => {
    function fetch() {
      axios
        .get(`/api/surveys`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        });
    }
    fetch();
  }, []);

  // const satu = groupByKey(data, "satu");
  // console.log(satu);
  // console.log(satu[Object.keys(satu)[0]].length);

  quest.forEach((item, idx) => {
    const baru = groupByKey(data, item.bil);
    quest[idx].chartData = baru;
    console.log(quest[idx]);
  });

  return (
    <>
      <Grid container spacing={2}>
        {quest.map((item) => (
          <Grid key={item.no} item md={6}>
            <Card>
              <CardContent>
                {item.no}. {item.quest}
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart width={600} height={600}>
                    <Pie
                      dataKey="value"
                      startAngle={360}
                      endAngle={0}
                      data={example}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    />
                  </PieChart>
                </ResponsiveContainer>
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
