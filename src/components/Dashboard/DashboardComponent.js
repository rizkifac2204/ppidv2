import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";
// TABLE
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// ICON
import ReportIcon from "@mui/icons-material/Report";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ModelTrainingIcon from "@mui/icons-material/ModelTraining";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import BalanceIcon from "@mui/icons-material/Balance";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

function getJumlah(arr, param) {
  if (!arr) return 0;
  const obj = arr.find((o) => o.status_permohonan === param);
  if (!obj) return 0;
  const kosong = arr.find((o) => o.status_permohonan === "");
  if (param === null) {
    return obj.jumlah + (kosong ? kosong.jumlah : 0);
  } else {
    return obj.jumlah;
  }
}

function DashboardCollapse({ expanded, arr, jumlah }) {
  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography color="primary">Status</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="primary">Jumlah</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* proses  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ModelTrainingIcon color="primary" />
                <Typography variant="body2" ml={1}>
                  Proses
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Proses")}
                <LinearProgress
                  variant="determinate"
                  color="primary"
                  value={(getJumlah(arr, "Proses") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
            {/* Diberikan  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DoneAllIcon color="success" />
                <Typography variant="body2" ml={1}>
                  Diberikan
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Diberikan")}
                <LinearProgress
                  variant="determinate"
                  color="success"
                  value={(getJumlah(arr, "Diberikan") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
            {/* Informasi Belum Dikuasai  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ReportIcon color="info" />
                <Typography variant="body2" ml={1}>
                  Informasi Belum Dikuasai
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Informasi Belum Dikuasai")}
                <LinearProgress
                  variant="determinate"
                  color="info"
                  value={
                    (getJumlah(arr, "Informasi Belum Dikuasai") / jumlah) * 100
                  }
                />
              </TableCell>
            </TableRow>
            {/* Informasi Belum Didokumentasikan  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ImageNotSupportedIcon color="info" />
                <Typography variant="body2" ml={1}>
                  Informasi Belum Didokumentasikan
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Informasi Belum Didokumentasikan")}
                <LinearProgress
                  variant="determinate"
                  color="info"
                  value={
                    (getJumlah(arr, "Informasi Belum Didokumentasikan") /
                      jumlah) *
                    100
                  }
                />
              </TableCell>
            </TableRow>
            {/* Ditolak  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HighlightOffIcon color="error" />
                <Typography variant="body2" ml={1}>
                  Tidak Dapat Diberikan / Ditolak
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Ditolak")}
                <LinearProgress
                  variant="determinate"
                  color="error"
                  value={(getJumlah(arr, "Ditolak") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
            {/* Proses Keberatan  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DoNotTouchIcon color="warning" />
                <Typography variant="body2" ml={1}>
                  Proses Keberatan
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Proses Keberatan")}
                <LinearProgress
                  variant="determinate"
                  color="warning"
                  value={(getJumlah(arr, "Proses Keberatan") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
            {/* Sengketa  */}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BalanceIcon color="warning" />
                <Typography variant="body2" ml={1}>
                  Sengketa
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Sengketa")}
                <LinearProgress
                  variant="determinate"
                  color="warning"
                  value={(getJumlah(arr, "Sengketa") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Collapse>
  );
}

function TableBelumRespon({ arr }) {
  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography color="primary">Bawaslu</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography color="primary">Jumlah</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {arr.result &&
          arr.result.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.nama_bawaslu}</TableCell>
              <TableCell align="right">{item.jumlah}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export { DashboardCollapse, TableBelumRespon };
