import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
// ICONS
import AddTaskIcon from "@mui/icons-material/AddTask";

const handleSubmit = (values, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/dip`, values)
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
      setSubmitting(false);
    });
};

const validationSchema = yup.object({
  divisi_id: yup.string().required("Harus Diisi"),
  sifat: yup.string().required("Harus Diisi"),
  materi: yup.string().required("Harus Diisi"),
  nama_dip: yup.string().required("Harus Diisi"),
  tahun: yup.number().required("Harus Diisi"),
  no_sk: yup.string().required("Harus Diisi"),
  penanggung_jawab: yup.string().required("Harus Diisi"),
  bentuk_informasi: yup.string().required("Harus Diisi"),
  jangka_waktu: yup.string().required("Harus Diisi"),
  link_file: yup.string().required("Harus Diisi"),
});

function DipAdd() {
  const [initialValues, setInitialValues] = useState({
    divisi_id: "",
    sifat: "",
    materi: "",
    nama_dip: "",
    tahun: "",
    no_sk: "",
    penanggung_jawab: "",
    bentuk_informasi: "",
    jangka_waktu: "",
    link_file: "",
  });
  const [divisis, setDivisis] = useState([]);

  useEffect(() => {
    const fetchDivisi = () => {
      axios
        .get(`/api/setting/divisi`)
        .then((res) => {
          setDivisis(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchDivisi();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
  });

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} gutterBottom>
          Tambah Daftar Informasi Publik
        </Typography>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={
                    formik.touched.divisi_id && Boolean(formik.errors.divisi_id)
                  }
                >
                  <InputLabel>Divisi *</InputLabel>
                  <Select
                    name="divisi_id"
                    label="Divisi *"
                    value={formik.values.divisi_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">Pilih</MenuItem>
                    {divisis.length !== 0 &&
                      divisis.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>
                            {item.nama_divisi}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  <FormHelperText>
                    {formik.touched.divisi_id && formik.errors.divisi_id}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{ mt: 2.6 }}
                  error={formik.touched.sifat && Boolean(formik.errors.sifat)}
                >
                  <InputLabel>Sifat *</InputLabel>
                  <Select
                    name="sifat"
                    label="Sifat *"
                    value={formik.values.sifat}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">Pilih</MenuItem>
                    <MenuItem value="Berkala">Berkala</MenuItem>
                    <MenuItem value="Serta Merta">Serta Merta</MenuItem>
                    <MenuItem value="Setiap Saat">Setiap Saat</MenuItem>
                  </Select>
                  <FormHelperText>
                    {formik.touched.sifat && formik.errors.sifat}
                  </FormHelperText>
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{ mt: 2.6, mb: 0.8 }}
                  error={formik.touched.materi && Boolean(formik.errors.materi)}
                >
                  <InputLabel>Materi *</InputLabel>
                  <Select
                    name="materi"
                    label="Materi *"
                    value={formik.values.materi}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">Pilih</MenuItem>
                    <MenuItem value="Kelembagaan">Kelembagaan</MenuItem>
                    <MenuItem value="Informasi Permilu">
                      Informasi Permilu
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    {formik.touched.materi && formik.errors.materi}
                  </FormHelperText>
                </FormControl>

                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Nama"
                  name="nama_dip"
                  value={formik.values.nama_dip}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.nama_dip && Boolean(formik.errors.nama_dip)
                  }
                  helperText={formik.touched.nama_dip && formik.errors.nama_dip}
                />

                <TextField
                  fullWidth
                  required
                  type="number"
                  margin="normal"
                  label="Tahun"
                  name="tahun"
                  value={formik.values.tahun}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tahun && Boolean(formik.errors.tahun)}
                  helperText={formik.touched.tahun && formik.errors.tahun}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Nomor SK"
                  name="no_sk"
                  value={formik.values.no_sk}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.no_sk && Boolean(formik.errors.no_sk)}
                  helperText={formik.touched.no_sk && formik.errors.no_sk}
                />

                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Bentuk Informasi"
                  name="bentuk_informasi"
                  value={formik.values.bentuk_informasi}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.bentuk_informasi &&
                    Boolean(formik.errors.bentuk_informasi)
                  }
                  helperText={
                    formik.touched.bentuk_informasi &&
                    formik.errors.bentuk_informasi
                  }
                />

                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Penanggung Jawab"
                  name="penanggung_jawab"
                  value={formik.values.penanggung_jawab}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.penanggung_jawab &&
                    Boolean(formik.errors.penanggung_jawab)
                  }
                  helperText={
                    formik.touched.penanggung_jawab &&
                    formik.errors.penanggung_jawab
                  }
                />

                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Jangka Waktu"
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

                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Link File"
                  name="link_file"
                  value={formik.values.link_file}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.link_file && Boolean(formik.errors.link_file)
                  }
                  helperText={
                    formik.touched.link_file && formik.errors.link_file
                  }
                />
              </Grid>

              <Grid item>
                <Button
                  disabled={formik.isSubmitting}
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
  );
}

DipAdd.auth = true;
DipAdd.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/dip",
    title: "Daftar Informasi Publik",
  },
  {
    path: "/admin/dip/add",
    title: "Tambah DIP",
  },
];
export default DipAdd;
