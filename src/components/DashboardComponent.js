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

function getJumlah(arr, param) {
  if (!arr) return 0;
  const obj = arr.find((o) => o.status === param);
  if (!obj) return 0;
  const kosong = arr.find((o) => o.status === "");
  if (param === null) {
    return obj.jumlah + kosong?.jumlah;
  } else {
    return obj.jumlah;
  }
}

function DashboardCollapse({ expanded, arr, jumlah, diterima }) {
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
            {diterima && (
              <TableRow>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ReportIcon color="primary" />
                  <Typography variant="body2" ml={1}>
                    Diterima
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {getJumlah(arr, null)}
                  <LinearProgress
                    variant="determinate"
                    value={(getJumlah(arr, null) / jumlah) * 100}
                  />
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ModelTrainingIcon color="secondary" />
                <Typography variant="body2" ml={1}>
                  Proses
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Diproses")}
                <LinearProgress
                  variant="determinate"
                  color="secondary"
                  value={(getJumlah(arr, "Diproses") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DoneAllIcon color="success" />
                <Typography variant="body2" ml={1}>
                  Diberikan Seluruhnya
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Diberikan Seluruhnya")}
                <LinearProgress
                  variant="determinate"
                  color="success"
                  value={
                    (getJumlah(arr, "Diberikan Seluruhnya") / jumlah) * 100
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CheckIcon color="warning" />
                <Typography variant="body2" ml={1}>
                  Diberikan Sebagian
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Diberikan Sebagian")}
                <LinearProgress
                  variant="determinate"
                  color="warning"
                  value={(getJumlah(arr, "Diberikan Sebagian") / jumlah) * 100}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HighlightOffIcon color="error" />
                <Typography variant="body2" ml={1}>
                  Tidak Dapat Diberikan
                </Typography>
              </TableCell>
              <TableCell align="right">
                {getJumlah(arr, "Tidak Dapat Diberikan")}
                <LinearProgress
                  variant="determinate"
                  color="error"
                  value={
                    (getJumlah(arr, "Tidak Dapat Diberikan") / jumlah) * 100
                  }
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
              <TableCell>
                {item.kepada} {item.provinsi}
              </TableCell>
              <TableCell align="right">{item.jumlah}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export { DashboardCollapse, TableBelumRespon };
