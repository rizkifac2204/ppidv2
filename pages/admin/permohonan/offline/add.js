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

const handleSubmit = (values) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/permohonan/offlines`, values)
    .then((res) => {
      console.log(res);
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
    });
};

const validationSchema = yup.object({
  reg_number: yup.string().required("Harus Diisi"),
  nama: yup.string().required("Harus Diisi"),
  identitas: yup.string().required("Harus Diisi"),
  identitas_jenis: yup.string().required("Harus Diisi"),
  tanggal: yup.string().required("Harus Diisi"),
  telp: yup.string().required("Harus Diisi"),
  email: yup.string().email("Email Tidak Valid").required("Harus Diisi"),
  pekerjaan: yup.string().required("Harus Diisi"),
  alamat: yup.string().required("Alamat Harus Diisi"),
  rincian: yup.string().required("Harus Diisi"),
  tujuan: yup.string().required("Harus Diisi"),
  cara_terima: yup.string().required("Harus Diisi"),
  cara_dapat: yup.string().required("Harus Diisi"),
  status: yup.string().required("Harus Diisi"),
  alasan: yup.string().when("status", {
    is: (status) =>
      status === "Diberikan Sebagian" || status === "Tidak Dapat Diberikan",
    then: yup
      .string()
      .required("Harus diisi jika tidak dapat diberikan seluruhnya"),
    otherwise: yup.string(),
  }),
});

function OfflineAdd() {
  const initialValues = {
    reg_number: "",
    nama: "",
    identitas: "",
    identitas_jenis: "",
    tanggal: "",
    telp: "",
    email: "",
    pekerjaan: "",
    alamat: "",
    rincian: "",
    tujuan: "",
    cara_terima: "",
    cara_dapat: "",
    status: "",
    alasan: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            Tambah Permohonan Offline
          </Typography>
          <Box>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Nomor Registrasi"
                    name="reg_number"
                    value={formik.values.reg_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.reg_number &&
                      Boolean(formik.errors.reg_number)
                    }
                    helperText={
                      formik.touched.reg_number && formik.errors.reg_number
                    }
                  />
                  <TextField
                    fullWidth
                    required
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                    label="Tanggal"
                    name="tanggal"
                    value={formik.values.tanggal}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.tanggal && Boolean(formik.errors.tanggal)
                    }
                    helperText={formik.touched.tanggal && formik.errors.tanggal}
                  />
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Nama"
                    name="nama"
                    value={formik.values.nama}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nama && Boolean(formik.errors.nama)}
                    helperText={formik.touched.nama && formik.errors.nama}
                  />

                  <Grid container spacing={1} mt={3}>
                    <Grid item xs={3}>
                      <FormControl
                        fullWidth
                        error={Boolean(formik.errors.identitas_jenis)}
                      >
                        <InputLabel>Jenis Identitas *</InputLabel>
                        <Select
                          name="identitas_jenis"
                          label="Jenis Identitas"
                          value={formik.values.identitas_jenis}
                          onChange={formik.handleChange}
                        >
                          <MenuItem value="KTP">KTP</MenuItem>
                          <MenuItem value="SIM">SIM</MenuItem>
                          <MenuItem value="KTM">KTM</MenuItem>
                        </Select>
                        <FormHelperText>
                          {formik.errors.identitas_jenis}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        fullWidth
                        required
                        label="Nomor Identitas"
                        name="identitas"
                        value={formik.values.identitas}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.identitas &&
                          Boolean(formik.errors.identitas)
                        }
                        helperText={
                          formik.touched.identitas && formik.errors.identitas
                        }
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Telp/HP"
                    name="telp"
                    value={formik.values.telp}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.telp && Boolean(formik.errors.telp)}
                    helperText={formik.touched.telp && formik.errors.telp}
                  />
                  <TextField
                    fullWidth
                    required
                    type="email"
                    margin="normal"
                    label="Email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Pekerjaan"
                    name="pekerjaan"
                    value={formik.values.pekerjaan}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.pekerjaan &&
                      Boolean(formik.errors.pekerjaan)
                    }
                    helperText={
                      formik.touched.pekerjaan && formik.errors.pekerjaan
                    }
                  />
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    margin="normal"
                    label="Alamat"
                    name="alamat"
                    value={formik.values.alamat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.alamat && Boolean(formik.errors.alamat)
                    }
                    helperText={formik.touched.alamat && formik.errors.alamat}
                  />
                </Grid>
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
                    error={
                      formik.touched.tujuan && Boolean(formik.errors.tujuan)
                    }
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
                      Cara Memerikan Informasi *
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

                  <FormControl
                    fullWidth
                    sx={{ mb: 3 }}
                    error={Boolean(formik.errors.status)}
                  >
                    <InputLabel>Status *</InputLabel>
                    <Select
                      name="status"
                      label="Status *"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Diproses">Diproses</MenuItem>
                      <MenuItem value="Diberikan Seluruhnya">
                        Diberikan Seluruhnya
                      </MenuItem>
                      <MenuItem value="Diberikan Sebagian">
                        Diberikan Sebagian
                      </MenuItem>
                      <MenuItem value="Tidak Dapat Diberikan">
                        Tidak Dapat Diberikan
                      </MenuItem>
                    </Select>
                    <FormHelperText>{formik.errors.status}</FormHelperText>
                  </FormControl>

                  {(formik.values.status === "Diberikan Sebagian" ||
                    formik.values.status === "Tidak Dapat Diberikan") && (
                    <FormControl
                      fullWidth
                      error={Boolean(formik.errors.alasan)}
                    >
                      <InputLabel>Alasan Tidak DIberikan Seluruhnya</InputLabel>
                      <Select
                        name="alasan"
                        label="Alasan Tidak DIberikan Seluruhnya"
                        value={formik.values.alasan}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value="Dikecualikan">Dikecualikan</MenuItem>
                        <MenuItem value="Tidak Dikuasai">
                          Tidak Dikuasai
                        </MenuItem>
                      </Select>
                      <FormHelperText>{formik.errors.alasan}</FormHelperText>
                    </FormControl>
                  )}
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
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
    </>
  );
}

OfflineAdd.auth = true;
OfflineAdd.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan/offline",
    title: "Permohonan Offline",
  },
  {
    path: "/admin/permohonan/offline",
    title: "Tambah",
  },
];
export default OfflineAdd;
