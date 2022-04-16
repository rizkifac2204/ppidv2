// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
//ICON
import Badge from "@mui/material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

function DetailSurvey(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
    >
      <DialogTitle>Detail Survey</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <AccountBalanceIcon sx={{ fontSize: 15 }} /> Kepada{" "}
            {props.detail.nama_bawaslu}
          </Grid>

          <Grid item xs={12}>
            <AccountBoxIcon sx={{ fontSize: 15 }} /> Oleh{" "}
            {props.detail.nama_pemohon} <br /> -{" "}
            {props.detail.pendidikan_pemohon} <br />-{" "}
            {props.detail.pekerjaan_pemohon} <br />-{" "}
            {props.detail.alamat_pemohon}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={1} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KESESUAIAN PERSYARATAN DENGAN JENIS PELAYANANNYA?
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q1}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={2} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KEMUDAHAN PROSEDUR PELAYANAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q2}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={3} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KECEPATAN WAKTU
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q3}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={4} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KEWAJARAN BIAYA/TARIF
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q4}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={5} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KESESUAIAN PRODUK PELAYANAN DENGAN HASIL YANG DIBERIKAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q5}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={6} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KOMPETENSI/KEMAMPUAN PETUGAS
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q6}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={7} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KESOPANAN DAN KERAMAHAN PETUGAS
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q7}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={8} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KUALITAS SARANA DAN PRASARANA
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q8}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={9} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            PENANGANAN PENGADUAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q9}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={10} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            TINGKAT KEPUASAN TERHADAP KESELURUHAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.q10}
          </Grid>

          <Grid item xs={12}>
            <TipsAndUpdatesIcon /> Saran <br />
            {props.detail.saran}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Typography variant="caption">
          Dibuat :{" "}
          {props.detail.created_at &&
            new Date(props.detail.created_at).toISOString().split("T")[0]}
        </Typography>
        <Button onClick={props.onClose} type="button">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DetailSurvey;
