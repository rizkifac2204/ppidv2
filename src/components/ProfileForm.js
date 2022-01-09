import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WaitLoadingComponent from "./WaitLoadingComponent";

function ProfileForm({ profile }) {
  // tunggu profile terbaca agar initialValues Formik Terbaca
  if (Object.keys(profile).length === 0) return <WaitLoadingComponent />;

  const handleSubmit = (values) => {
    const toastProses = toast.loading("Tunggu Sebentar...");
    axios
      .put(`/api/profile`, values)
      .then((res) => {
        console.log(res.data);
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
    nama: yup.string("Masukan Nama").required("Harus Diisi"),
    telp: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
    email: yup
      .string("Masukan Email")
      .email("Email Tidak Valid")
      .required("Password Harus Diisi"),
    alamat: yup.string().required("Alamat Harus Diisi"),
    username: yup.string().required("Username Harus Diisi"),
    passwordConfirm: yup.string().required("Password Harus Diisi"),
  });

  const formik = useFormik({
    initialValues: { ...profile, passwordConfirm: "" },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Ganti Data Profile
          </Typography>

          <Box>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                required
                margin="normal"
                placeholder="Ganti Nama"
                label="Nama"
                name="nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama && Boolean(formik.errors.nama)}
                helperText={formik.touched.nama && formik.errors.nama}
              />
              <TextField
                fullWidth
                required
                margin="normal"
                placeholder="Telp"
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
                margin="normal"
                type="email"
                placeholder="Email"
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
                multiline
                rows={3}
                margin="normal"
                placeholder="Alamat"
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
                placeholder="Username"
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                fullWidth
                margin="normal"
                required
                type="password"
                placeholder="Password Lama"
                label="Password Lama"
                name="passwordConfirm"
                value={formik.values.passwordConfirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.passwordConfirm &&
                  Boolean(formik.errors.passwordConfirm)
                }
                helperText={
                  formik.touched.passwordConfirm &&
                  formik.errors.passwordConfirm
                }
              />
              <Button type="submit" variant="contained" endIcon={<EditIcon />}>
                Update
              </Button>
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default ProfileForm;
