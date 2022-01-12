import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Card, CardContent, Grid, Box, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const handleSubmit = (values) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/setting/wilayah`, values)
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
    });
};

const validationSchema = yup.object({
  email: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Password Harus Diisi"),
  telp: yup.string().required("Telp Harus Diisi"),
  alamat: yup.string().required("Alamat Harus Diisi"),
  kota: yup.string().required("Kota Harus Diisi"),
  ppid: yup.string().required("URL PPID Harus Diisi"),
  fb: yup.string(),
  tw: yup.string(),
  yt: yup.string(),
  ig: yup.string(),
});

const Wilayah = () => {
  const [data, setData] = useState({
    id: null,
    id_wilayah: null,
    email: "",
    telp: "",
    kota: "",
    alamat: "",
    ppid: "",
    fb: "",
    tw: "",
    yt: "",
    ig: "",
  });
  useEffect(() => {
    function fetcData() {
      axios
        .get(`/api/setting/wilayah`)
        .then((res) => {
          if (res.data) setData(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
    fetcData();
  }, []);

  const formik = useFormik({
    initialValues: data,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Card>
      <CardContent>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              required
              margin="normal"
              type="email"
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
              label="HP / Telp"
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
              multiline
              rows={3}
              margin="normal"
              label="Alamat"
              name="alamat"
              value={formik.values.alamat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.alamat && Boolean(formik.errors.alamat)}
              helperText={formik.touched.alamat && formik.errors.alamat}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="Kota"
              name="kota"
              value={formik.values.kota}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.kota && Boolean(formik.errors.kota)}
              helperText={formik.touched.kota && formik.errors.kota}
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="URL PPID"
              name="ppid"
              value={formik.values.ppid}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ppid && Boolean(formik.errors.ppid)}
              helperText={formik.touched.ppid && formik.errors.ppid}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Facebook"
                  name="fb"
                  value={formik.values.fb}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fb && Boolean(formik.errors.fb)}
                  helperText={formik.touched.fb && formik.errors.fb}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Twitter"
                  name="tw"
                  value={formik.values.tw}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tw && Boolean(formik.errors.tw)}
                  helperText={formik.touched.tw && formik.errors.tw}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Youtube"
                  name="yt"
                  value={formik.values.yt}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.yt && Boolean(formik.errors.yt)}
                  helperText={formik.touched.yt && formik.errors.yt}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Instagram"
                  name="ig"
                  value={formik.values.ig}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ig && Boolean(formik.errors.ig)}
                  helperText={formik.touched.ig && formik.errors.ig}
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" endIcon={<EditIcon />}>
              Submit
            </Button>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
};

Wilayah.auth = true;
Wilayah.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/wilayah",
    title: "Profile Bawaslu",
  },
];
export default Wilayah;
