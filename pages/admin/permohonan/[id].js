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
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import PrintIcon from "@mui/icons-material/Print";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import FileCopyIcon from "@mui/icons-material/FileCopy";
//Component
import WaitLoadingComponent from "components/WaitLoadingComponent";
import { FormatedDate, WithDynamicImage } from "components/Attributes";
import DataPermohonan from "components/PrintPage/DataPermohonan";
import BuktiPermohonan from "components/PrintPage/BuktiPermohonan";
import ResponseDialog from "components/permohonan/ResponseDialog";
import ResponseCard from "components/permohonan/ResponseCard";

function PermohonanDetail() {
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const [responses, setResponses] = useState([]);
  const [openResponse, setOpenResponse] = useState(false);
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const { id } = router.query;

  const printRef = useRef();
  const printBuktiRef = useRef();

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/permohonan/` + id)
          .then((res) => {
            setDetail(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/permohonan"), 1000);
          });
      };
      const fetchResponses = () => {
        axios
          .get(`/api/permohonan/` + id + "/responses")
          .then((res) => {
            setResponses(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      };

      fetchDetail();
      fetchResponses();
    }
  }, [id, router]);

  const onDeleteResponse = (id) => {
    const filtered = responses.filter((data) => {
      return data.id != id;
    });
    setResponses(filtered);
  };

  // ACTION NORMAL
  const handleDelete = () => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/` + id)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.push("/admin/permohonan");
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
  // PRINT
  const handlePrint = (param) => {
    const isNotReady = Object.keys(profileBawaslu).length === 0;
    if (isNotReady)
      return fetchProfileBawaslu(() => {
        param === "bukti" ? processPrintBukti() : processPrint();
      });
    param === "bukti" ? processPrintBukti() : processPrint();
  };
  const processPrint = useReactToPrint({
    content: () => printRef.current,
  });
  const processPrintBukti = useReactToPrint({
    content: () => printBuktiRef.current,
  });
  // RESPONSE
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
      <WaitLoadingComponent loading={Object.keys(detail).length == 0} />
      {Object.keys(detail).length !== 0 && (
        <>
          <Card sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ bgcolor: "background.paper", p: 2 }}
            >
              Detail Permohonan {detail.no_registrasi}
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
                  <WithDynamicImage image={detail.identitas_pemohon} />
                </Grid>
                <Grid item xs={12} md={9}>
                  <Grid container>
                    <Grid item xs={4}>
                      Nomor Registrasi / Tiket
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.no_registrasi} /{" "}
                      <Typography variant="caption" color="primary">
                        {detail.tiket}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      Kepada
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.nama_bawaslu}
                    </Grid>

                    <Grid item xs={4}>
                      Tanggal
                    </Grid>
                    <Grid item xs={8}>
                      : <FormatedDate tanggal={detail.tanggal_permohonan} />
                    </Grid>

                    <Grid item xs={4}>
                      Nama
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.nama_pemohon}
                    </Grid>

                    <Grid item xs={4}>
                      Pekerjaan
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.pekerjaan_pemohon}
                    </Grid>

                    <Grid item xs={4}>
                      Pendidikan
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.pendidikan_pemohon}
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

                    <Grid item xs={4}>
                      Alamat
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.alamat_pemohon}
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
                      Status Permohonan
                    </Grid>
                    <Grid item xs={8}>
                      : {detail.status_permohonan}
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
                      FabProps={
                        {
                          // disabled: Boolean(
                          //   action.name === "Print Bukti Permohonan" &&
                          //     !detail.no_registrasi
                          // ),
                        }
                      }
                    />
                  ))}
                </SpeedDial>
              </Box>
            </Box>
          </Card>

          <Grid container spacing={2}>
            {responses.map((respon) => (
              <ResponseCard
                key={respon.id}
                data={respon}
                onDeleteResponse={onDeleteResponse}
                responses={responses}
                setResponses={setResponses}
              />
            ))}
          </Grid>

          <ResponseDialog
            open={openResponse}
            onClose={handleCloseResponse}
            fullScreen={true}
            detail={detail}
            setDetail={setDetail}
            responses={responses}
            setResponses={setResponses}
          />

          <DataPermohonan
            ref={printRef}
            detail={detail}
            profileBawaslu={profileBawaslu}
          />
          <BuktiPermohonan
            ref={printBuktiRef}
            detail={detail}
            profileBawaslu={profileBawaslu}
          />
        </>
      )}
    </>
  );
}

PermohonanDetail.auth = true;
PermohonanDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan",
    title: "Permohonan",
  },
  {
    path: "/admin/permohonan",
    title: "Detail",
  },
];
export default PermohonanDetail;
