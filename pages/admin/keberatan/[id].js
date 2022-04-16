import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PrintIcon from "@mui/icons-material/Print";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import BuktiPengajuanKeberatan from "components/PrintPage/BuktiPengajuanKeberatan";

function KeberatanDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState({});
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const printBuktiRef = useRef();

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/keberatans/` + id)
          .then((res) => {
            setDetail(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/keberatan"), 2000);
          });
      };
      fetchDetail();
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
        .delete(`/api/keberatans/` + id)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.push("/admin/keberatan");
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

  const fetchProfileBawaslu = (callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/services/profileBawaslu?id=` + detail.bawaslu_id)
      .then((res) => {
        setProfileBawaslu(res.data);
        toast.dismiss(toastProses);
        callback();
      })
      .catch((err) => {
        console.log(err);
        toast.update(toastProses, {
          render: "Terjadi Kesalahan",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };
  const processPrintBukti = useReactToPrint({
    content: () => printBuktiRef.current,
  });
  const handlePrint = () => {
    const isNotReady = Object.keys(profileBawaslu).length === 0;
    if (isNotReady)
      return fetchProfileBawaslu(() => {
        processPrintBukti();
      });
    processPrintBukti();
  };

  const actions = [
    { icon: <PrintIcon />, name: "Print", action: handlePrint },
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
              DETAIL KEBERATAN ATAS PERMOHONAN INFORMASI
            </Typography>
            <CardContent>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    A. INFORMASI PENGAJU KEBERATAN
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  Nomor Registrasi
                </Grid>
                <Grid item xs={8}>
                  : {detail.no_registrasi}
                </Grid>

                <Grid item xs={4}>
                  Informasi
                </Grid>
                <Grid item xs={8}>
                  : {detail.rincian}
                </Grid>

                <Grid item xs={4}>
                  Tujuan Penggunaan Informasi
                </Grid>
                <Grid item xs={8}>
                  : {detail.tujuan}
                </Grid>

                <Grid item xs={12} mt={2}>
                  <b>Identitas Pemohon</b>
                </Grid>

                <Grid item xs={4}>
                  Nama
                </Grid>
                <Grid item xs={8}>
                  : {detail.nama_pemohon}
                </Grid>

                <Grid item xs={4}>
                  Alamat
                </Grid>
                <Grid item xs={8}>
                  : {detail.alamat_pemohon}
                </Grid>

                <Grid item xs={4}>
                  Pekerjaan
                </Grid>
                <Grid item xs={8}>
                  : {detail.pekerjaann_pemohon}
                </Grid>

                <Grid item xs={4}>
                  Telp/Hp
                </Grid>
                <Grid item xs={8}>
                  : {detail.telp_pemohon}
                </Grid>

                <Grid item xs={4}>
                  Email
                </Grid>
                <Grid item xs={8}>
                  : {detail.email_pemohon}
                </Grid>

                <Grid item xs={12} mt={2}>
                  <b>Identitas Kuasa Pemohon</b>
                </Grid>

                <Grid item xs={4}>
                  Nama
                </Grid>
                <Grid item xs={8}>
                  :
                </Grid>

                <Grid item xs={4}>
                  Alamat
                </Grid>
                <Grid item xs={8}>
                  :
                </Grid>

                <Grid item xs={4}>
                  Nomor Telepon
                </Grid>
                <Grid item xs={8}>
                  :
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Typography variant="h6">
                    B. ALASAN PENGAJUAN KEBERATAN
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_a)}
                        />
                      }
                      label="Permohonan Informasi ditolak"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_b)}
                        />
                      }
                      label="Informasi berkala tidak disediakan"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_c)}
                        />
                      }
                      label="Permintaan Informasi tidak ditanggapi"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_d)}
                        />
                      }
                      label="Permintaan Informasi ditanggapi tidak sebagaimana yang diminta"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_e)}
                        />
                      }
                      label="Permintaan Informasi tidak dipenuhi"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_f)}
                        />
                      }
                      label="Biaya yang dikenakan tidak wajar"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={Boolean(detail.alasan_g)}
                        />
                      }
                      label="Informasi disampaikan melebihi jangka waktu yang ditentukan"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Typography variant="h6">C. KASUS POSISI</Typography>
                </Grid>

                <Grid item xs={12}>
                  {detail.kasus_posisi}
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Typography variant="h6">
                    D. HARI/TANGGAL TANGGAPAN ATAS KEBERATAN AKAN DIBERIKAN
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  {detail.tanggal_keberatan &&
                    new Date(detail.tanggal_keberatan)
                      .toISOString()
                      .split("T")[0]}
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

          <BuktiPengajuanKeberatan
            ref={printBuktiRef}
            detail={detail}
            profileBawaslu={profileBawaslu}
          />
        </>
      )}
    </>
  );
}

KeberatanDetail.auth = true;
KeberatanDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/keberatan",
    title: "Keberatan",
  },
  {
    path: "/admin/keberatan/detail",
    title: "Detail",
  },
];
export default KeberatanDetail;
