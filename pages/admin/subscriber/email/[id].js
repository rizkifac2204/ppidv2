import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
// ICON
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

function EmailDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [detail, setDetail] = useState({});
  const [list, setList] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchDetail = () => {
        axios
          .get(`/api/subscriber/email/` + id)
          .then((res) => {
            setDetail(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setTimeout(() => router.push("/admin/subscriber/email"), 2000);
          })
          .then(() => setLoading(false));
      };
      fetchDetail();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!detail.listPenerima) return;
    const email = detail.listPenerima.map((item) => {
      return item.email_subscriber;
    });
    const text = email.join(", ");
    setList(text);
  }, [detail]);

  const handleDelete = () => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/subscriber/email/${id}`)
        .then((res) => {
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          router.push("/admin/subscriber/email");
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
    { icon: <DeleteIcon />, name: "Hapus", action: handleDelete },
  ];

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item>
            <Avatar sx={{ m: 1, bgcolor: "white" }}>
              <Image src="/images/logo.png" layout="fill" alt="PPID" />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4">{detail.subjek}</Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="caption">PPID</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table sx={{}} aria-label="simple table">
                    <TableBody>
                      <TableRow>
                        <TableCell>Dari</TableCell>
                        <TableCell>: PPID Bawaslu</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provinsi</TableCell>
                        <TableCell>: {detail.provinsi}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Kabupaten/Kota</TableCell>
                        <TableCell>: {detail.kabupaten}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>: Terkirim</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>
                          :{" "}
                          {detail.sended_at &&
                            new Date(detail.sended_at)
                              .toISOString()
                              .split("T")[0]}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Subjek</TableCell>
                        <TableCell>: {detail.subjek}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Penerima</TableCell>
                        {detail.penerima === "All" ? (
                          <TableCell>: Semua Subscriber</TableCell>
                        ) : (
                          <TableCell>
                            :
                            <Tooltip title={list}>
                              <VisibilityIcon fontSize="small" />
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(detail.isi),
              }}
            ></div>
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
  );
}

EmailDetail.auth = true;
EmailDetail.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/subscriber",
    title: "Subscriber",
  },
  {
    path: "/admin/subscriber/email",
    title: "Email",
  },
  {
    path: "/admin/subscriber/email",
    title: "Detail",
  },
];
export default EmailDetail;
