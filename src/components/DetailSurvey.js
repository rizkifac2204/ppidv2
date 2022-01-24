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
            {props.detail.kepada} {props.detail.provinsi}{" "}
            {props.detail.kabupaten}
          </Grid>

          <Grid item xs={12}>
            <AccountBoxIcon sx={{ fontSize: 15 }} /> Oleh {props.detail.nama}{" "}
            <br /> - {props.detail.pendidikan} <br />- {props.detail.pekerjaan}{" "}
            <br />- {props.detail.alamat}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={1} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KESESUAIAN PERSYARATAN DENGAN JENIS PELAYANANNYA?
          </Grid>
          <Grid item xs={6}>
            : {props.detail.satu}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={2} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KEMUDAHAN PROSEDUR PELAYANAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.dua}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={3} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KECEPATAN WAKTU
          </Grid>
          <Grid item xs={6}>
            : {props.detail.tiga}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={4} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KEWAJARAN BIAYA/TARIF
          </Grid>
          <Grid item xs={6}>
            : {props.detail.empat}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={5} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KESESUAIAN PRODUK PELAYANAN DENGAN HASIL YANG DIBERIKAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.lima}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={6} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KOMPETENSI/KEMAMPUAN PETUGAS
          </Grid>
          <Grid item xs={6}>
            : {props.detail.enam}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={7} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KESOPANAN DAN KERAMAHAN PETUGAS
          </Grid>
          <Grid item xs={6}>
            : {props.detail.tujuh}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={8} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            KUALITAS SARANA DAN PRASARANA
          </Grid>
          <Grid item xs={6}>
            : {props.detail.delapan}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={9} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            PENANGANAN PENGADUAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.sembilan}
          </Grid>

          <Grid item xs={6}>
            <Badge badgeContent={10} color="secondary" sx={{ mr: 2 }}>
              <HelpCenterIcon sx={{ fontSize: 20 }} />
            </Badge>
            TINGKAT KEPUASAN TERHADAP KESELURUHAN
          </Grid>
          <Grid item xs={6}>
            : {props.detail.sepuluh}
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
