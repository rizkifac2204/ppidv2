import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";

function DipDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState({});

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/dip/` + id)
          .then((res) => {
            setDetail(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/dip"), 2000);
          });
      };
      fetchDetail();
    }
  }, [id, router]);

  const handleDelete = () => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/dip/` + id)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.push("/admin/dip");
        })
        .catch((err) => {
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };

  const actions = [
    {
      icon: <EditIcon />,
      name: "Edit",
      action: () => router.push("/admin/dip/" + detail.id + "/edit"),
    },
    { icon: <DeleteIcon />, name: "Hapus", action: handleDelete },
  ];

  return (
    <>
      <WaitLoadingComponent loading={Object.keys(detail).length == 0} />
      {Object.keys(detail).length !== 0 && (
        <>
          <Card>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ bgcolor: "background.paper", p: 2 }}
            >
              DETAIL DAFTAR INFORMASI PUBLIK
            </Typography>
            <CardContent>
              <Grid container>
                <Grid item xs={4}>
                  Bawaslu
                </Grid>
                <Grid item xs={8}>
                  : {detail.nama_bawaslu}
                </Grid>

                <Grid item xs={4}>
                  Unit Yang Menguasai
                </Grid>
                <Grid item xs={8}>
                  : {detail.nama_divisi}
                </Grid>

                <Grid item xs={4}>
                  Sifat
                </Grid>
                <Grid item xs={8}>
                  : {detail.sifat}
                </Grid>

                <Grid item xs={4}>
                  Jenis Informasi
                </Grid>
                <Grid item xs={8}>
                  : {detail.jenis_informasi}
                </Grid>

                <Grid item xs={4}>
                  Ringkasan
                </Grid>
                <Grid item xs={8}>
                  : {detail.ringkasan}
                </Grid>

                <Grid item xs={4}>
                  Tahun Pembuatan
                </Grid>
                <Grid item xs={8}>
                  : {detail.tahun_pembuatan}
                </Grid>

                <Grid item xs={4}>
                  Nomor SK
                </Grid>
                <Grid item xs={8}>
                  : {detail.no_sk}
                </Grid>

                <Grid item xs={4}>
                  Penanggung Jawab
                </Grid>
                <Grid item xs={8}>
                  : {detail.penanggung_jawab}
                </Grid>

                <Grid item xs={4}>
                  Bentuk Informasi
                </Grid>
                <Grid item xs={8}>
                  : {detail.bentuk_informasi}
                </Grid>

                <Grid item xs={4}>
                  Jangka Waktu
                </Grid>
                <Grid item xs={8}>
                  : {detail.jangka_waktu} Tahun
                </Grid>

                <Grid item xs={4}>
                  File Informasi
                </Grid>
                <Grid item xs={8}>
                  :{" "}
                  <a target="_blank" rel="noreferrer" href={detail.link_file}>
                    {detail.link_file}
                  </a>
                </Grid>
              </Grid>
            </CardContent>
            <Box p={2}>
              <Typography variant="caption">
                Dibuat :{" "}
                {detail.created_at &&
                  new Date(detail.created_at).toISOString().split("T")[0]}
              </Typography>
              <Box sx={{ transform: "translateZ(0px)", flexGrow: 1 }}>
                <SpeedDial
                  ariaLabel="SpeedDial basic example"
                  sx={{ position: "absolute", bottom: 0, right: 0 }}
                  icon={<SpeedDialIcon />}
                >
                  {actions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      tooltipTitle={action.name}
                      onClick={action.action}
                    />
                  ))}
                </SpeedDial>
              </Box>
            </Box>
          </Card>
        </>
      )}
    </>
  );
}

DipDetail.auth = true;
DipDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/dip",
    title: "Daftar Informasi Publik",
  },
  {
    path: "/admin/dip/detail",
    title: "Detail",
  },
];
export default DipDetail;
