import Image from "next/image";
import React from "react";
// MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
// Components
import { SetQRCode, CurrentDate } from "components/Attributes";

const themeLight = createTheme({
  palette: {
    mode: "light",
  },
});

const DataPermohonanOnline = React.forwardRef(
  ({ detail, profileBawaslu }, ref) => {
    return (
      <ThemeProvider theme={themeLight}>
        <Card sx={{ display: "none", displayPrint: "block", p: 2 }} ref={ref}>
          <Box sx={{ display: "flex", flexWrap: "nowrap", p: 2, mb: 2 }}>
            <Box sx={{ position: "relative", width: 100, height: 90, mr: 3 }}>
              <Image
                src="/images/logo-buttom.png"
                alt="Logo"
                layout="fill"
                priority
              />
            </Box>
            <Box>
              <Typography variant="h5">
                <b>BADAN PENGAWA PEMILIHAN UMUM</b>
              </Typography>
              <Typography>
                {profileBawaslu.alamat} <br />
                {profileBawaslu.telp} / {profileBawaslu.email}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" align="center">
            DATA PERMOHONAN INFORMASI PUBLIK
          </Typography>

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>
                    Yang menyerahkan formulir permohonan Informasi Publik:
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Nama</TableCell>
                  <TableCell>
                    : <b>{detail.nama}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pekerjaan</TableCell>
                  <TableCell>
                    : <b>{detail.pekerjaan}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Telp</TableCell>
                  <TableCell>
                    : <b>{detail.telp}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    : <b>{detail.email}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alamat</TableCell>
                  <TableCell>
                    : <b>{detail.alamat}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tanggal Pemohonan</TableCell>
                  <TableCell>
                    : <b>{detail.tanggal}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Rincian</TableCell>
                  <TableCell>
                    : <b>{detail.rincian}</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tujuan</TableCell>
                  <TableCell>
                    : <b>{detail.tujuan}</b>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ border: 0 }}>
                  <TableCell colSpan={2}>
                    {profileBawaslu.kota}, <CurrentDate />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Box>
              <SetQRCode text={detail.reg_number} />
              <Box sx={{ fontSize: 10, m: 1 }}>
                (Kode merupakan bukti Sah dari Sistem PPID Bawaslu <br /> selama
                dapat terbaca dan terscan dengan benar)
              </Box>
            </Box>
            <Box sx={{ position: "relative", width: 100, height: 90, mr: 3 }}>
              <Image
                src={"/upload/" + detail.ktp}
                alt="Logo"
                layout="fill"
                priority
              />
              <Box sx={{ fontSize: 10, m: 1 }}>Pemohon</Box>
            </Box>
          </Box>
        </Card>
      </ThemeProvider>
    );
  }
);

DataPermohonanOnline.displayName = "DataPermohonanOnline";
export default DataPermohonanOnline;
