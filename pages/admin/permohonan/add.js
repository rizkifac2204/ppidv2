import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
// ICONS
import AddTaskIcon from "@mui/icons-material/AddTask";

const handleSubmit = (values, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/permohonan`, values)
    .then((res) => {
      toast.update(toastProses, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      console.log(err.response.data);
      toast.update(toastProses, {
        render: err.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .then(() => {
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    });
};

const validationSchema = yup.object({
  no_registrasi: yup.string("Masukan Nomor Registrasi").required("Harus Diisi"),
  tanggal_permohonan: yup.string("Masukan Tanggal").required("Harus Diisi"),
  platform: yup.string("Masukan platform").required("Harus Diisi"),
  nama_pemohon: yup.string("Masukan Nama").required("Harus Diisi"),
  pekerjaan_pemohon: yup.string("Masukan Pekerjaan").required("Harus Diisi"),
  pendidikan_pemohon: yup.string("Masukan Pendidikan").required("Harus Diisi"),
  telp_pemohon: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email_pemohon: yup
    .string()
    .email("Email Tidak Valid")
    .required("Harus Diisi"),
  alamat_pemohon: yup.string().required("Alamat Harus Diisi"),
  rincian: yup.string().required("Harus Diisi"),
  tujuan: yup.string().required("Harus Diisi"),
  cara_terima: yup.string().required("Harus Diisi"),
  cara_dapat: yup.string().required("Harus Diisi"),
  status_permohonan: yup.string().required("Harus Diisi"),
  // RESPON ####################################
  jenis_respon: yup.string().required("Harus Diisi"),
  penguasaan_informasi: yup.string().required("Harus Diisi"),
  // jika badan publik lain
  penguasaan_informasi_lain: yup.string().when("penguasaan_informasi", {
    is: (v) => v === "Badan Publik Lain",
    then: yup.string().required("Isi Badan Publik"),
  }),
  penjelasan_penghitaman: yup.string().required("Harus Diisi"),
  jangka_waktu: yup.number().required("Harus Diisi"),
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

function PermohonanAdd() {
  const initialValues = {
    no_registrasi: "",
    tanggal_permohonan: "",
    platform: "",
    nama_pemohon: "",
    pekerjaan_pemohon: "",
    pendidikan_pemohon: "",
    telp_pemohon: "",
    email_pemohon: "",
    alamat_pemohon: "",
    rincian: "",
    tujuan: "",
    cara_terima: "",
    cara_dapat: "",
    status_permohonan: "",
    // RESPON  #######################################
    jenis_respon: "",
    penjelasan_penghitaman: "",
    jangka_waktu: "",
    penguasaan_informasi: "",
    penguasaan_informasi_lain: "",
    // diberikan
    bentuk_fisik: "",
    ket_biaya: "",
    // ditolak
    dasar_pengecualian: "",
    pada_pasal: "",
    ket_konsekuensi: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
  });

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} gutterBottom>
          Tambah Permohonan Informasi
        </Typography>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* kolom pertama  */}
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
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  label="Tanggal Permohonan"
                  name="tanggal_permohonan"
                  value={formik.values.tanggal_permohonan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.tanggal_permohonan &&
                    Boolean(formik.errors.tanggal_permohonan)
                  }
                  helperText={
                    formik.touched.tanggal_permohonan &&
                    formik.errors.tanggal_permohonan
                  }
                />
                <FormControl
                  fullWidth
                  sx={{ my: 1 }}
                  error={Boolean(formik.errors.platform)}
                >
                  <InputLabel>Platform *</InputLabel>
                  <Select
                    name="platform"
                    label="platform *"
                    value={formik.values.platform}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Langsung">Langsung</MenuItem>
                    <MenuItem value="Telepon">Telepon</MenuItem>
                    <MenuItem value="Media Sosial">Media Sosial</MenuItem>
                    <MenuItem value="Website">Website</MenuItem>
                    <MenuItem value="Aplikasi">Aplikasi</MenuItem>
                  </Select>
                  <FormHelperText>{formik.errors.platform}</FormHelperText>
                </FormControl>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Nama"
                  name="nama_pemohon"
                  value={formik.values.nama_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.nama_pemohon &&
                    Boolean(formik.errors.nama_pemohon)
                  }
                  helperText={
                    formik.touched.nama_pemohon && formik.errors.nama_pemohon
                  }
                />
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Pekerjaan"
                  name="pekerjaan_pemohon"
                  value={formik.values.pekerjaan_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.pekerjaan_pemohon &&
                    Boolean(formik.errors.pekerjaan_pemohon)
                  }
                  helperText={
                    formik.touched.pekerjaan_pemohon &&
                    formik.errors.pekerjaan_pemohon
                  }
                />
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Pendidikan"
                  name="pendidikan_pemohon"
                  value={formik.values.pendidikan_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.pendidikan_pemohon &&
                    Boolean(formik.errors.pendidikan_pemohon)
                  }
                  helperText={
                    formik.touched.pendidikan_pemohon &&
                    formik.errors.pendidikan_pemohon
                  }
                />
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Telp/HP"
                  name="telp_pemohon"
                  value={formik.values.telp_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.telp_pemohon &&
                    Boolean(formik.errors.telp_pemohon)
                  }
                  helperText={
                    formik.touched.telp_pemohon && formik.errors.telp_pemohon
                  }
                />
                <TextField
                  fullWidth
                  required
                  type="email"
                  margin="normal"
                  label="Email"
                  name="email_pemohon"
                  value={formik.values.email_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.email_pemohon &&
                    Boolean(formik.errors.email_pemohon)
                  }
                  helperText={
                    formik.touched.email_pemohon && formik.errors.email_pemohon
                  }
                />
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  margin="normal"
                  label="Alamat"
                  name="alamat_pemohon"
                  value={formik.values.alamat_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.alamat_pemohon &&
                    Boolean(formik.errors.alamat_pemohon)
                  }
                  helperText={
                    formik.touched.alamat_pemohon &&
                    formik.errors.alamat_pemohon
                  }
                />
              </Grid>
              {/* kolom kedua  */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  margin="normal"
                  label="Rincian Informasi"
                  name="rincian"
                  value={formik.values.rincian}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.rincian && Boolean(formik.errors.rincian)
                  }
                  helperText={formik.touched.rincian && formik.errors.rincian}
                />
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  margin="normal"
                  label="Tujuan Informasi"
                  name="tujuan"
                  value={formik.values.tujuan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tujuan && Boolean(formik.errors.tujuan)}
                  helperText={formik.touched.tujuan && formik.errors.tujuan}
                />

                <FormControl
                  sx={{ my: 3 }}
                  component="fieldset"
                  error={Boolean(formik.errors.cara_terima)}
                  variant="standard"
                >
                  <FormLabel component="legend">
                    Format Informasi Yang Diberikan *
                  </FormLabel>
                  <RadioGroup
                    aria-label="cara_terima"
                    name="cara_terima"
                    value={formik.values.cara_terima}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="Melihat/Membaca/Mendengarkan/Mencatat"
                      control={<Radio />}
                      label="Melihat/Membaca/Mendengarkan/Mencatat"
                    />
                    <FormControlLabel
                      value="Mendapatkan salinan Informasi (hardcopy/softcopy)"
                      control={<Radio />}
                      label="Mendapatkan salinan Informasi (hardcopy/softcopy)"
                    />
                  </RadioGroup>
                  <FormHelperText>{formik.errors.cara_terima}</FormHelperText>
                </FormControl>

                <FormControl
                  component="fieldset"
                  error={Boolean(formik.errors.cara_dapat)}
                  variant="standard"
                >
                  <FormLabel component="legend">
                    Cara Memberikan Informasi *
                  </FormLabel>
                  <RadioGroup
                    aria-label="cara_dapat"
                    name="cara_dapat"
                    value={formik.values.cara_dapat}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="Mengambil Langsung"
                      control={<Radio />}
                      label="Mengambil Langsung"
                    />
                    <FormControlLabel
                      value="Pos"
                      control={<Radio />}
                      label="Pos"
                    />
                    <FormControlLabel
                      value="Email"
                      control={<Radio />}
                      label="Email"
                    />
                    <FormControlLabel
                      value="Kurir"
                      control={<Radio />}
                      label="Kurir"
                    />
                    <FormControlLabel
                      value="Faksimili"
                      control={<Radio />}
                      label="Faksimili"
                    />
                  </RadioGroup>
                  <FormHelperText>{formik.errors.cara_dapat}</FormHelperText>
                </FormControl>
              </Grid>
              {/* status permohonan  */}
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  sx={{ mb: 3 }}
                  error={Boolean(formik.errors.status_permohonan)}
                >
                  <InputLabel>Status Permohonan *</InputLabel>
                  <Select
                    name="status_permohonan"
                    label="Status Permohonan *"
                    value={formik.values.status_permohonan}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value="Proses">Diproses</MenuItem>
                    <MenuItem value="Diberikan">Diberikan</MenuItem>
                    <MenuItem value="Tidak Dapat Diberikan">
                      Tidak Dapat Diberikan
                    </MenuItem>
                    <MenuItem value="Ditolak">Ditolak</MenuItem>
                    <MenuItem value="Proses Keberatan">
                      Proses Keberatan
                    </MenuItem>
                    <MenuItem value="Sengketa">Sengketa</MenuItem>
                  </Select>
                  <FormHelperText>
                    {formik.errors.status_permohonan}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* kolom respon terakhir */}
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                  Respon Yang Diberikan
                </Typography>

                <Grid container columnSpacing={1}>
                  {/* Jenis Respon  */}
                  <Grid item xs={12} md={6}>
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
                        <MenuItem value="Respon Perbaikan">
                          Respon Perbaikan
                        </MenuItem>
                        <MenuItem value="Respon Penolakan">
                          Respon Penolakan
                        </MenuItem>
                        <MenuItem value="Respon Keberatan">
                          Respon Keberatan
                        </MenuItem>
                      </Select>
                      <FormHelperText>
                        {formik.errors.jenis_respon}
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
                  {formik.values.penguasaan_informasi ===
                    "Badan Publik Lain" && (
                    <Grid item xs={12} md={6}>
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
                    </Grid>
                  )}

                  {/* #################DIBERIKAN################## */}
                  {formik.values.status_permohonan === "Diberikan" && (
                    <>
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
                          <FormHelperText>
                            {formik.errors.bentuk_fisik}
                          </FormHelperText>
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
                            formik.touched.ket_biaya &&
                            Boolean(formik.errors.ket_biaya)
                          }
                          helperText={
                            formik.touched.ket_biaya && formik.errors.ket_biaya
                          }
                        />
                      </Grid>
                    </>
                  )}

                  {/* #################DITOLAK#################### */}
                  {formik.values.status_permohonan === "Ditolak" && (
                    <>
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
                            formik.touched.pada_pasal &&
                            formik.errors.pada_pasal
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
                    </>
                  )}

                  {/* #################UMUM################## */}
                  <>
                    {/* penjelasan penghitaman  */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        multiline
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
                          formik.touched.jangka_waktu &&
                          formik.errors.jangka_waktu
                        }
                      />
                    </Grid>
                  </>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                  variant="contained"
                  endIcon={<AddTaskIcon />}
                >
                  Simpan
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}

PermohonanAdd.auth = true;
PermohonanAdd.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan",
    title: "Permohonan",
  },
  {
    path: "/admin/permohonan",
    title: "Tambah",
  },
];
export default PermohonanAdd;
