import Image from "next/image";
import React from "react";
// MUI
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
// Components
import { SetQRCode, CurrentDate } from "components/Attributes";
const logo = "/images/logo-buttom.png";

export const DataPermohonanOnline = React.forwardRef(
  ({ detail, profileBawaslu }, ref) => {
    return (
      <Card sx={{ display: "none", displayPrint: "block", p: 2 }} ref={ref}>
        <Box sx={{ display: "flex", flexWrap: "nowrap", p: 2, mb: 2 }}>
          <Box sx={{ position: "relative", width: 100, height: 90, mr: 3 }}>
            <Image src={logo} alt="Logo" layout="fill" priority />
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

        <Grid container>
          <Grid item sm={6}>
            <SetQRCode text="apa" />
            <Box sx={{ fontSize: 10, m: 1 }}>
              (Kode merupakan bukti Sah dari Sistem PPID Bawaslu <br /> selama
              dapat terbaca dan terscan dengan benar)
            </Box>
          </Grid>
          <Grid item sm={6}>
            <Box sx={{ position: "relative", width: 100, height: 90, mr: 3 }}>
              <Image src={logo} alt="Logo" layout="fill" priority />
            </Box>
            <Box sx={{ fontSize: 10, m: 1 }}>Pemohon</Box>
          </Grid>
        </Grid>
      </Card>
    );
  }
);
