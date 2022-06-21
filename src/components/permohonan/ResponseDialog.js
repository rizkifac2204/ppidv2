import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import HelpIcon from "@mui/icons-material/Help";

const handleSubmit = (values, props, setSubmitting) => {
  const postData = {
    ...values,
    email_pemohon: props.detail.email_pemohon,
    tiket: props.detail.tiket,
  };
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/permohonan/${values.permohonan_id}/responses`, postData)
    .then((res) => {
      props.setDetail({
        ...props.detail,
        no_registrasi: values.no_registrasi,
        status_permohonan: values.status_permohonan,
      });
      // ini tambahan dari halaman tabel
      if (props.data) {
        setTimeout(() => {
          props.setData(
            props.data.map((item) =>
              item.id === values.permohonan_id
                ? {
                    ...item,
                    no_registrasi: values.no_registrasi,
                    status_permohonan: values.status_permohonan,
                  }
                : item
            )
          );
        });
      }
      // ini tambahan dari halaman detail
      if (props.responses) {
        const joinedResponses = props.responses.concat(res.data.dataCallback);
        props.setResponses(joinedResponses);
      }
      setTimeout(() => props.onClose(), 1000);
      toast.update(toastProses, {
        render: res.data.message,
        type: res.data.type,
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      console.log(err);
      toast.update(toastProses, {
        render: err.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .then(() => {
      setSubmitting(false);
    });
};

const validationSchema = yup.object({
  no_registrasi: yup.string().required("Harus Diisi"),
  status_permohonan: yup.string().required("Harus Diisi"),
  jenis_respon: yup.string().required("Harus Diisi"),
  penguasaan_informasi: yup.string().required("Harus Diisi"),
  // jika badan publik lain
  penguasaan_informasi_lain: yup.string().when("penguasaan_informasi", {
    is: (v) => v === "Badan Publik Lain",
    then: yup.string().required("Isi Badan Publik"),
  }),
  penjelasan_penghitaman: yup.string().when("status_permohonan", {
    is: (v) => v === "Tidak Dapat Diberukan",
    then: yup.string().required("Harus Diisi"),
  }),
  jangka_waktu: yup.number().when("jenis_respon", {
    is: (v) => v === "Respon Final",
    then: yup.number().required("Harus Diisi"),
  }),
  pesan: yup.string().required("Harus Diisi"),
  // diberikan
  bentuk_fisik: yup.string().when("status_permohonan", {
    is: (v) => v === "Diberikan",
    then: yup.string().required("Harus Diisi"),
  }),
  ket_biaya: yup.number().when("status_permohonan", {
    is: (v) => v === "Diberikan",
    then: yup.number().required("Harus Diisi"),
  }),
  // ditolak
  dasar_pengecualian: yup.string().when("status_permohonan", {
    is: (v) => v === "Ditolak",
    then: yup.string().required("Harus Diisi"),
  }),
  pada_pasal: yup.string().when("status_permohonan", {
    is: (v) => v === "Ditolak",
    then: yup.string().required("Harus Diisi"),
  }),
  ket_konsekuensi: yup.string().when("status_permohonan", {
    is: (v) => v === "Ditolak",
    then: yup.string().required("Harus Diisi"),
  }),
});

function ResponseDialog(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const formik = useFormik({
    initialValues: {
      current_no_registrasi: props.detail.no_registrasi
        ? props.detail.no_registrasi
        : "",
      no_registrasi: props.detail.no_registrasi
        ? props.detail.no_registrasi
        : "",
      permohonan_id: props.detail.id ? props.detail.id : "",
      status_permohonan: props.detail.status_permohonan
        ? props.detail.status_permohonan
        : "",
      jenis_respon: "",
      penjelasan_penghitaman: "",
      jangka_waktu: "",
      pesan: "",
      mailed: true,
      penguasaan_informasi: "",
      penguasaan_informasi_lain: "",
      // diberikan
      bentuk_fisik: "",
      ket_biaya: "",
      // ditolak
      dasar_pengecualian: "",
      pada_pasal: "",
      ket_konsekuensi: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, props, setSubmitting),
  });

  useEffect(() => {
    if (props.open) formik.resetForm();
  }, [props.open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          Response {props.detail.no_registrasi} {props.detail.tiket}
        </DialogTitle>
        <DialogContent>
          {/* #################UMUM################## */}
          <Grid container columnSpacing={1}>
            {/* No Registrasi  */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                margin="normal"
                label="Nomor Registrasi"
                name="no_registrasi"
                value={formik.values.no_registrasi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_registrasi &&
                  Boolean(formik.errors.no_registrasi)
                }
                helperText={
                  formik.touched.no_registrasi && formik.errors.no_registrasi
                }
              />
            </Grid>

            {/* Jenis Respon  */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FormControl
                  fullWidth
                  required
                  margin="normal"
                  error={Boolean(formik.errors.jenis_respon)}
                >
                  <InputLabel>Jenis Respon</InputLabel>
                  <Select
                    name="jenis_respon"
                    label="Jenis Respon"
                    value={formik.values.jenis_respon}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Respon Awal">Respon Awal</MenuItem>
                    <MenuItem value="Respon Lanjutan">Respon Lanjutan</MenuItem>
                    <MenuItem value="Respon Final">Respon Final</MenuItem>
                    <MenuItem value="Respon Perbaikan">
                      Respon Perbaikan
                    </MenuItem>
                    <MenuItem value="Respon Keberatan">
                      Respon Keberatan
                    </MenuItem>
                  </Select>
                  <FormHelperText>{formik.errors.jenis_respon}</FormHelperText>
                </FormControl>
                <Button
                  aria-describedby={
                    Boolean(anchorEl) ? "login-google" : undefined
                  }
                  variant="text"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <HelpIcon fontSize="small" />
                </Button>
                <Popover
                  id={Boolean(anchorEl) ? "login-google" : undefined}
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <>
                    <Typography color="inherit">Jenis Respon</Typography>
                    <ul>
                      <li>
                        Respon Awal : merupakan Respon Pertama yang diberikan
                        (Biasanya pada saat memberikan Nomor Registrasi)
                      </li>
                      <li>
                        Respon Lanjutan : merupakan Respon setelah respon awal
                        dan belum selesai dalam memberikan informasi
                      </li>
                      <li>
                        Respon Final : merupakan Respon terkahir setelah
                        memberikan informasi yang diminta
                      </li>
                      <li>
                        Respon Perbaikan : merupakan Respon jika terjadi
                        perbaikan dalam memberikan informasi
                      </li>
                      <li>
                        Respon Keberatan : merupakan Respon yang diberikan
                        setelah permohon melakukan keberatan terkait permohonan
                      </li>
                    </ul>
                  </>
                </Popover>
              </Box>
            </Grid>

            {/* Status Permohonan  */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                margin="normal"
                error={Boolean(formik.errors.status_permohonan)}
              >
                <InputLabel>Status Permohonan</InputLabel>
                <Select
                  name="status_permohonan"
                  label="Status Permohonan"
                  value={formik.values.status_permohonan}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Proses">Diproses</MenuItem>
                  <MenuItem value="Diberikan">Diberikan</MenuItem>
                  <MenuItem value="Tidak Dapat Diberikan">
                    Tidak Dapat Diberikan
                  </MenuItem>
                  <MenuItem value="Ditolak">Ditolak</MenuItem>
                  <MenuItem value="Proses Keberatan">Proses Keberatan</MenuItem>
                  <MenuItem value="Sengketa">Sengketa</MenuItem>
                </Select>
                <FormHelperText>
                  {formik.errors.status_permohonan}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Penguasaan Informasi */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                margin="normal"
                error={Boolean(formik.errors.penguasaan_informasi)}
              >
                <InputLabel>Penguasaan Informasi</InputLabel>
                <Select
                  name="penguasaan_informasi"
                  label="Penguasaan Informasi"
                  value={formik.values.penguasaan_informasi}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="Bawaslu">Bawaslu</MenuItem>
                  <MenuItem value="Badan Publik Lain">
                    Badan Publik Lain...
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {formik.errors.penguasaan_informasi}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Penguasaan Informasi Lain */}
            <Grid item xs={12} md={6}>
              {formik.values.penguasaan_informasi === "Badan Publik Lain" && (
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Badan Publik"
                  name="penguasaan_informasi_lain"
                  value={formik.values.penguasaan_informasi_lain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.penguasaan_informasi_lain &&
                    Boolean(formik.errors.penguasaan_informasi_lain)
                  }
                  helperText={
                    formik.touched.penguasaan_informasi_lain &&
                    formik.errors.penguasaan_informasi_lain
                  }
                />
              )}
            </Grid>
          </Grid>

          {/* #################DIBERIKAN################## */}
          {formik.values.status_permohonan === "Diberikan" && (
            <Grid container columnSpacing={1}>
              {/* Bentuk Fisik  */}
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  required
                  margin="normal"
                  error={Boolean(formik.errors.bentuk_fisik)}
                >
                  <InputLabel>Bentuk Fisik</InputLabel>
                  <Select
                    name="bentuk_fisik"
                    label="Bentuk Fisik"
                    value={formik.values.bentuk_fisik}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Softcopy">Softcopy</MenuItem>
                    <MenuItem value="Hardcopy">Hardcopy</MenuItem>
                  </Select>
                  <FormHelperText>{formik.errors.bentuk_fisik}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Biaya  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  margin="normal"
                  label="Biaya"
                  name="ket_biaya"
                  value={formik.values.ket_biaya}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.ket_biaya && Boolean(formik.errors.ket_biaya)
                  }
                  helperText={
                    formik.touched.ket_biaya && formik.errors.ket_biaya
                  }
                />
              </Grid>
            </Grid>
          )}

          {/* #################DITOLAK#################### */}
          {formik.values.status_permohonan === "Ditolak" && (
            <Grid container columnSpacing={1}>
              {/* dasar pengecualian  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Dasar Pengecualian"
                  name="dasar_pengecualian"
                  value={formik.values.dasar_pengecualian}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.dasar_pengecualian &&
                    Boolean(formik.errors.dasar_pengecualian)
                  }
                  helperText={
                    formik.touched.dasar_pengecualian &&
                    formik.errors.dasar_pengecualian
                  }
                />
              </Grid>

              {/* pada pasal  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Pada Pasal"
                  name="pada_pasal"
                  value={formik.values.pada_pasal}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.pada_pasal &&
                    Boolean(formik.errors.pada_pasal)
                  }
                  helperText={
                    formik.touched.pada_pasal && formik.errors.pada_pasal
                  }
                />
              </Grid>

              {/* konsekuensi  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                  label="Keterangan Konsekuensi"
                  name="ket_konsekuensi"
                  value={formik.values.ket_konsekuensi}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.ket_konsekuensi &&
                    Boolean(formik.errors.ket_konsekuensi)
                  }
                  helperText={
                    formik.touched.ket_konsekuensi &&
                    formik.errors.ket_konsekuensi
                  }
                />
              </Grid>
            </Grid>
          )}

          {/* #################TIDAKDAPATDIBERIKAN#################### */}
          {formik.values.status_permohonan === "Tidak Dapat Diberikan" && (
            <Grid container columnSpacing={1}>
              {/* penjelasan penghitaman  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={2}
                  margin="normal"
                  label="Penjelasan Penghitaman"
                  name="penjelasan_penghitaman"
                  value={formik.values.penjelasan_penghitaman}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.penjelasan_penghitaman &&
                    Boolean(formik.errors.penjelasan_penghitaman)
                  }
                  helperText={
                    formik.touched.penjelasan_penghitaman &&
                    formik.errors.penjelasan_penghitaman
                  }
                />
              </Grid>
            </Grid>
          )}

          {/* #################FINAL################## */}
          {formik.values.jenis_respon === "Respon Final" && (
            <Grid container columnSpacing={1}>
              {/* waktu  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  margin="normal"
                  label="Jangka Waktu Proses (Hari)"
                  name="jangka_waktu"
                  value={formik.values.jangka_waktu}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.jangka_waktu &&
                    Boolean(formik.errors.jangka_waktu)
                  }
                  helperText={
                    formik.touched.jangka_waktu && formik.errors.jangka_waktu
                  }
                />
              </Grid>
            </Grid>
          )}

          {/* #################UMUM################## */}
          <Grid container columnSpacing={1}>
            {/* pesan  */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                margin="normal"
                label="Pesan Kepada Pemohon"
                name="pesan"
                value={formik.values.pesan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pesan && Boolean(formik.errors.pesan)}
                helperText={formik.touched.pesan && formik.errors.pesan}
              />
            </Grid>
          </Grid>

          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Kirim Email Kepada Pemohon"
              name="mailed"
              onChange={formik.handleChange}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button type="submit" disabled={formik.isSubmitting}>
            Simpan dan Tutup
          </Button>
          <Button onClick={props.onClose} type="button">
            Tutup
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ResponseDialog;
