import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
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
import PrintIcon from "@mui/icons-material/Print";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";

function OnlineDetail() {
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const [response, setResponse] = useState({});
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/permohonan/onlines/` + id)
          .then((res) => {
            setDetail(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/permohonan/online"), 2000);
          });
      };
      const fetchResponse = () => {
        axios
          .get(`/api/permohonan/onlines/` + id + "/response")
          .then((res) => {
            setResponse(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      };

      fetchDetail();
      fetchResponse();
    }
    return () => {
      // console.log("clear");
    };
  }, [id, router]);

  const handleDelete = () => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/onlines/` + id)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.push("/admin/permohonan/online");
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
  const handleResponse = () => {
    console.log("response");
  };

  const handlePrint = () => {
    console.log("Print Laporan ini");
  };

  const formatedDate = (tanggal) => {
    if (!tanggal) return;
    var date = new Date(tanggal);
    if (date instanceof Date && !isNaN(date.valueOf())) {
      return date.toISOString().split("T")[0];
    } else {
      return "-";
    }
  };

  const actions = [
    { icon: <LocalLibraryIcon />, name: "Tanggapi", action: handleResponse },
    { icon: <PrintIcon />, name: "Print", action: handlePrint },
    { icon: <DeleteIcon />, name: "Hapus", action: handleDelete },
  ];

  const src = "https://picsum.photos/id/237/200/300";

  return (
    <>
      {Object.keys(detail).length == 0 ? (
        <WaitLoadingComponent />
      ) : (
        <>
          <Card>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ bgcolor: "background.paper", p: 2 }}
            >
              Detail Permohonan {detail.reg_number}
            </Typography>
            <CardContent>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    position: "relative",
                    minHeight: 200,
                  }}
                >
                  <Image
                    src={src}
                    alt="KTP"
                    layout="fill"
                    priority
                    objectFit="contain"
                  />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container>
                    <Grid item xs={4}>
                      Nomor Registrasi / Tiket
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.reg_number} /{" "}
                      <Typography variant="caption" color="primary">
                        {detail.tiket_number}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      Kepada
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.kepada} {detail.provinsi} {detail.kabupaten}
                    </Grid>

                    <Grid item xs={4}>
                      Tanggal
                    </Grid>
                    <Grid item xs={8}>
                      : {formatedDate(detail.tanggal)}
                    </Grid>

                    <Grid item xs={4}>
                      Nama
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.nama}
                    </Grid>

                    <Grid item xs={4}>
                      Pekerjaan
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.pekerjaan}
                    </Grid>

                    <Grid item xs={4}>
                      Telp/Hp
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.telp}
                    </Grid>

                    <Grid item xs={4}>
                      Email
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.email}
                    </Grid>

                    <Grid item xs={4}>
                      Alamat
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.alamat}
                    </Grid>

                    <Grid item xs={4}>
                      Rincian Informasi
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.rincian}
                    </Grid>

                    <Grid item xs={4}>
                      Tujuan Informasi
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.tujuan}
                    </Grid>

                    <Grid item xs={4}>
                      Cara Terima Informasi
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.cara_terima}
                    </Grid>

                    <Grid item xs={4}>
                      Cara Dapat Informasi
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.cara_dapat}
                    </Grid>

                    <Grid item xs={4}>
                      Status
                    </Grid>
                    <Grid item xs={8}>
                      : {response.status}{" "}
                      {response.alasan && `- ${response.alasan}`}
                      {response.mailed && (
                        <MarkEmailReadIcon fontSize="small" color="primary" />
                      )}
                    </Grid>

                    <Grid item xs={4}>
                      Waktu Pelayanan
                    </Grid>
                    <Grid item xs={8}>
                      : {response.waktu} Hari
                    </Grid>

                    <Grid item xs={4}>
                      Pesan Kepada Pemohon
                    </Grid>
                    <Grid item xs={8}>
                      : {response.response}
                    </Grid>

                    <Grid item xs={4}>
                      File Pendukung
                    </Grid>
                    <Grid item xs={8}>
                      : {response.file}
                    </Grid>
                  </Grid>
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

OnlineDetail.auth = true;
OnlineDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan/online",
    title: "Permohonan Online",
  },
  {
    path: "/admin/permohonan/online",
    title: "Detail",
  },
];
export default OnlineDetail;
