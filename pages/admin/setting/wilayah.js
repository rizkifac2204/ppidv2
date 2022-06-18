import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { Card, CardContent, Grid, Box, Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const handleSubmit = (values, setSubmitting) => {
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
    })
    .then(() => {
      setSubmitting(false);
    });
};

const validationSchema = yup.object({
  nama_bawaslu: yup.string().required("Harus Diisi"),
  email_bawaslu: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Harus Diisi"),
  telp_bawaslu: yup.string().required("Harus Diisi"),
  alamat_bawaslu: yup.string().required("Alamat Harus Diisi"),
  kota_bawaslu: yup.string().required("Kota Harus Diisi"),
  web_profile: yup.string().required("URL PPID Harus Diisi"),
  web_ppid: yup.string().required("URL PPID Harus Diisi"),
  facebook: yup.string(),
  twitter: yup.string(),
  youtube: yup.string(),
  instagram: yup.string(),
});

const Wilayah = () => {
  const [data, setData] = useState({
    nama_bawaslu: "",
    email_bawaslu: "",
    telp_bawaslu: "",
    alamat_bawaslu: "",
    kota_bawaslu: "",
    web_profile: "",
    web_ppid: "",
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
  });
  useEffect(() => {
    function fetcData() {
      axios
        .get(`/api/setting/wilayah`)
        .then((res) => {
          const forInit = {
            ...res.data,
            nama_bawaslu: res.data.nama_bawaslu ?? "",
            email_bawaslu: res.data.email_bawaslu ?? "",
            telp_bawaslu: res.data.telp_bawaslu ?? "",
            alamat_bawaslu: res.data.alamat_bawaslu ?? "",
            kota_bawaslu: res.data.kota_bawaslu ?? "",
            web_profile: res.data.web_profile ?? "",
            web_ppid: res.data.web_ppid ?? "",
            facebook: res.data.facebook ?? "",
            twitter: res.data.twitter ?? "",
            youtube: res.data.youtube ?? "",
            instagram: res.data.instagram ?? "",
          };
          setData(forInit);
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
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
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
              label="Nama Bawaslu"
              name="nama_bawaslu"
              value={formik.values.nama_bawaslu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nama_bawaslu &&
                Boolean(formik.errors.nama_bawaslu)
              }
              helperText={
                formik.touched.nama_bawaslu && formik.errors.nama_bawaslu
              }
            />
            <TextField
              fullWidth
              required
              margin="normal"
              type="email"
              label="Email Bawaslu"
              name="email_bawaslu"
              value={formik.values.email_bawaslu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.email_bawaslu &&
                Boolean(formik.errors.email_bawaslu)
              }
              helperText={
                formik.touched.email_bawaslu && formik.errors.email_bawaslu
              }
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="HP / Telp Bawaslu"
              name="telp_bawaslu"
              value={formik.values.telp_bawaslu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.telp_bawaslu &&
                Boolean(formik.errors.telp_bawaslu)
              }
              helperText={
                formik.touched.telp_bawaslu && formik.errors.telp_bawaslu
              }
            />
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              margin="normal"
              label="Alamat Bawaslu"
              name="alamat_bawaslu"
              value={formik.values.alamat_bawaslu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.alamat_bawaslu &&
                Boolean(formik.errors.alamat_bawaslu)
              }
              helperText={
                formik.touched.alamat_bawaslu && formik.errors.alamat_bawaslu
              }
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="Kota"
              name="kota_bawaslu"
              value={formik.values.kota_bawaslu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.kota_bawaslu &&
                Boolean(formik.errors.kota_bawaslu)
              }
              helperText={
                formik.touched.kota_bawaslu && formik.errors.kota_bawaslu
              }
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="URL Website"
              name="web_profile"
              value={formik.values.web_profile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.web_profile && Boolean(formik.errors.web_profile)
              }
              helperText={
                formik.touched.web_profile && formik.errors.web_profile
              }
            />
            <TextField
              fullWidth
              required
              margin="normal"
              label="URL PPID"
              name="web_ppid"
              value={formik.values.web_ppid}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.web_ppid && Boolean(formik.errors.web_ppid)}
              helperText={formik.touched.web_ppid && formik.errors.web_ppid}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Facebook"
                  name="facebook"
                  value={formik.values.facebook}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.facebook && Boolean(formik.errors.facebook)
                  }
                  helperText={formik.touched.facebook && formik.errors.facebook}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Twitter"
                  name="twitter"
                  value={formik.values.twitter}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.twitter && Boolean(formik.errors.twitter)
                  }
                  helperText={formik.touched.twitter && formik.errors.twitter}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Youtube"
                  name="youtube"
                  value={formik.values.youtube}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.youtube && Boolean(formik.errors.youtube)
                  }
                  helperText={formik.touched.youtube && formik.errors.youtube}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Alamat Instagram"
                  name="instagram"
                  value={formik.values.instagram}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.instagram && Boolean(formik.errors.instagram)
                  }
                  helperText={
                    formik.touched.instagram && formik.errors.instagram
                  }
                />
              </Grid>
            </Grid>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="contained"
              endIcon={<EditIcon />}
            >
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
