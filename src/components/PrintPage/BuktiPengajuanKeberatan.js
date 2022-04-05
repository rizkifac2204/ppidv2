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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
// Components
import { SetQRCode, CurrentDate } from "components/Attributes";

const themeLight = createTheme({
  palette: {
    mode: "light",
  },
});

const BuktiPengajuanKeberatan = React.forwardRef(
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
                {profileBawaslu.alamat_bawaslu} <br />
                {profileBawaslu.telp_bawaslu} / {profileBawaslu.email_bawaslu}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" align="center">
            PERNYATAAN KEBERATAN ATAS PERMOHONAN INFORMASI
          </Typography>

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell width={1}>
                    <b>A</b>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <b>INFORMASI PENGAJU KEBERATAN</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <b>Nomor Tiket keberatan</b>
                  </TableCell>
                  <TableCell>
                    : <b>{detail.no_registrasi}</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <b>Nomor Pendaftaran Pemohon</b>
                  </TableCell>
                  <TableCell>: -</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <b>Informasi</b>
                  </TableCell>
                  <TableCell>: {detail.rincian}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <b>Tujuan Penggunaan Informasi</b>
                  </TableCell>
                  <TableCell>: {detail.tujuan}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>
                    <b>Identitas Pemohon</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>: {detail.nama_pemohon}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>: {detail.alamat_pemohon}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Pekerjaan</TableCell>
                  <TableCell>: {detail.pekerjaan_pemohon}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Nomor Telepon</TableCell>
                  <TableCell>: {detail.telp_pemohon}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>
                    <b>Identitas Kuasa Pemohon</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>: {detail.nama_kuasa}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>: {detail.alamat_kuasa}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Nomor Telepon</TableCell>
                  <TableCell>: {detail.telp_kuasa}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>B</b>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <b>ALASAN PENGAJUAN KEBERATAN</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>
                    <FormGroup>
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_a)}
                          />
                        }
                        label="Permohonan Informasi ditolak"
                      />
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_b)}
                          />
                        }
                        label="Informasi berkala tidak disediakan"
                      />
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_c)}
                          />
                        }
                        label="Permintaan Informasi tidak ditanggapi"
                      />
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_d)}
                          />
                        }
                        label="Permintaan Informasi ditanggapi tidak sebagaimana yang diminta"
                      />
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_e)}
                          />
                        }
                        label="Permintaan Informasi tidak dipenuhi"
                      />
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_f)}
                          />
                        }
                        label="Biaya yang dikenakan tidak wajar"
                      />
                      <FormControlLabel
                        disabled
                        control={
                          <Checkbox
                            size="small"
                            checked={Boolean(detail.alasan_g)}
                          />
                        }
                        label="Informasi disampaikan melebihi jangka waktu yang ditentukan"
                      />
                    </FormGroup>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>C</b>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <b>KASUS POSISI</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>{detail.kasus_posisi}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <b>D</b>
                  </TableCell>
                  <TableCell colSpan={2}>
                    <b>HARI/TANGGAL TANGGAPAN ATAS KEBERATAN AKAN DIBERIKAN</b>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell></TableCell>
                  <TableCell colSpan={2}>
                    {detail.tanggal_keberatan &&
                      new Date(detail.tanggal_keberatan)
                        .toISOString()
                        .split("T")[0]}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ border: 0 }}>
                  <TableCell colSpan={2}>
                    {profileBawaslu.kota_bawaslu}, <CurrentDate />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box>
            <SetQRCode text={"keberatan/" + detail.no_registrasi} />
            <Box sx={{ fontSize: 10, m: 1 }}>
              (Kode merupakan bukti Sah dari Sistem PPID Bawaslu <br /> selama
              dapat terbaca dan terscan dengan benar)
            </Box>
          </Box>
        </Card>
      </ThemeProvider>
    );
  }
);

BuktiPengajuanKeberatan.displayName = "BuktiPengajuanKeberatan";
export default BuktiPengajuanKeberatan;
