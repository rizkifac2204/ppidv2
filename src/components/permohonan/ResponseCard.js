import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";

import { FormatedDate, NumberWithCommas } from "components/Attributes";
import FileAction from "components/FileAction";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function ResponseCard({ data, onDeleteResponse, responses, setResponses }) {
  const deleteRespon = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/permohonan/` + data.permohonan_id + `/responses/` + id)
        .then((res) => {
          onDeleteResponse(id);
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
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

  return (
    <Grid item xs={12} md={6}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <CardHeader
            avatar={<Avatar {...stringAvatar(data.jenis_respon)} />}
            title={data.jenis_respon}
            subheader={<FormatedDate tanggal={data.tanggal_respon} />}
          />
          <CardActions disableSpacing>
            {data.mailed ? (
              <Tooltip title="Email Terkirim">
                <MarkEmailReadIcon fontSize="small" color="primary" />
              </Tooltip>
            ) : (
              <Tooltip title="Email Tidak Terkirim">
                <CancelScheduleSendIcon fontSize="small" color="primary" />
              </Tooltip>
            )}
            <IconButton
              aria-label="Hapus Response"
              onClick={(e) => {
                e.preventDefault();
                deleteRespon(data.id);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </AccordionSummary>
        <AccordionDetails>
          <Card>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Penguasaan Informasi:
                    </Typography>
                    <Typography gutterBottom>
                      {data.penguasaan_informasi}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Bentuk Fisik:
                    </Typography>
                    <Typography gutterBottom>{data.bentuk_fisik}</Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Biaya:
                    </Typography>
                    <Typography gutterBottom>
                      Rp. <NumberWithCommas number={data.ket_biaya} />
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Jangka Waktu:
                    </Typography>
                    <Typography gutterBottom>
                      {data.jangka_waktu} Hari
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Penjelasan Penghitaman:
                    </Typography>
                    <Typography gutterBottom>
                      {data.penjelasan_penghitaman}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Surat Pemberitahuan
                    </Typography>
                    <br />
                    <FileAction
                      path="pemberitahuan"
                      namaFile="file_surat_pemberitahuan"
                      data={data}
                      responses={responses}
                      setResponses={setResponses}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      File Informasi:
                    </Typography>
                    <br />
                    <FileAction
                      path="response"
                      namaFile="file_informasi"
                      data={data}
                      responses={responses}
                      setResponses={setResponses}
                    />
                  </Paper>
                </Grid>

                {data.tolak_id && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 1, bgcolor: "warning.main" }}>
                      <Typography variant="caption" color="secondary">
                        Dasar Pengecualian
                      </Typography>
                      <Typography gutterBottom>
                        {data.dasar_pengecualian}
                      </Typography>

                      <Typography variant="caption" color="secondary">
                        Pada Pasal
                      </Typography>
                      <Typography gutterBottom>{data.pada_pasal}</Typography>

                      <Typography variant="caption" color="secondary">
                        Keterangan Konsekuensi
                      </Typography>
                      <Typography gutterBottom>
                        {data.ket_konsekuensi}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Paper sx={{ p: 1 }}>
                    <Typography variant="caption" color="secondary">
                      Pesan Admin:
                    </Typography>
                    <Typography gutterBottom>{data.pesan}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
export default ResponseCard;
