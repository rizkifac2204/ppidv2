// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
// component
import { FormatedDate } from "components/Attributes";

function DetailPermohonan({ open, onClose, detail }) {
  return (
    <Dialog open={open} onClose={onClose} fullScreen={true}>
      <DialogTitle>Detail Permohonan</DialogTitle>
      <DialogContent>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
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
                    Status
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
          </Box>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} type="button">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DetailPermohonan;
