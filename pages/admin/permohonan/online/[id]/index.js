import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
import Tooltip from "@mui/material/Tooltip";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PrintIcon from "@mui/icons-material/Print";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import FileCopyIcon from "@mui/icons-material/FileCopy";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import { FormatedDate } from "components/Attributes";
import DataPermohonanOnline from "components/PrintPage/DataPermohonanOnline";
import BuktiPermohonanOnline from "components/PrintPage/BuktiPermohonanOnline";
import ResponseDialog from "components/ResponseDialog";

function OnlineDetail() {
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const [response, setResponse] = useState({});
  const [openResponse, setOpenResponse] = useState(false);
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const { id } = router.query;

  const printRef = useRef();
  const printBuktiRef = useRef();

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
  const fetchProfileBawaslu = (callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/permohonan/profileBawaslu?id=` + detail.id_will)
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
  const handlePrint = (param) => {
    const isNotReady = Object.keys(profileBawaslu).length === 0;
    if (isNotReady)
      return fetchProfileBawaslu(() => {
        if (param === "bukti") {
          processPrintBukti();
        } else {
          processPrint();
        }
      });
    if (param === "bukti") {
      processPrintBukti();
    } else {
      processPrint();
    }
  };
  const processPrint = useReactToPrint({
    content: () => printRef.current,
  });
  const processPrintBukti = useReactToPrint({
    content: () => printBuktiRef.current,
  });

  const handleResponse = () => {
    setOpenResponse(true);
  };
  const handleCloseResponse = () => {
    setOpenResponse(false);
  };

  const actions = [
    { icon: <LocalLibraryIcon />, name: "Tanggapi", action: handleResponse },
    {
      icon: <FileCopyIcon />,
      name: "Print Bukti Permohonan",
      action: () => handlePrint("bukti"),
    },
    {
      icon: <PrintIcon />,
      name: "Print Data Permohonan",
      action: () => handlePrint("data"),
    },
    { icon: <DeleteIcon />, name: "Hapus", action: handleDelete },
  ];

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
                    src={"/upload/" + detail.ktp}
                    alt="KTP"
                    layout="fill"
                    objectFit="contain"
                    priority
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
                      : <FormatedDate tanggal={detail.tanggal} />
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
                      {response.mailed ? (
                        <Tooltip title="Email Terkirim">
                          <MarkEmailReadIcon fontSize="small" color="primary" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Email Tidak Terkirim">
                          <CancelScheduleSendIcon
                            fontSize="small"
                            color="primary"
                          />
                        </Tooltip>
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
                  ariaLabel="SpeedDial"
                  sx={{ position: "absolute", bottom: 0, right: 0 }}
                  icon={<SpeedDialIcon />}
                >
                  {actions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      tooltipTitle={action.name}
                      onClick={action.action}
                      FabProps={{
                        disabled: Boolean(
                          action.name === "Print Bukti Permohonan" &&
                            !detail.reg_number
                        ),
                      }}
                    />
                  ))}
                </SpeedDial>
              </Box>
            </Box>
          </Card>

          <ResponseDialog
            open={openResponse}
            onClose={handleCloseResponse}
            fullScreen={true}
            detail={detail}
            response={response}
            setDetail={setDetail}
            setResponse={setResponse}
          />

          <DataPermohonanOnline
            ref={printRef}
            detail={detail}
            profileBawaslu={profileBawaslu}
          />
          <BuktiPermohonanOnline
            ref={printBuktiRef}
            detail={detail}
            profileBawaslu={profileBawaslu}
          />
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
