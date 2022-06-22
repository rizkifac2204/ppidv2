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

const handleSubmit = (values, setDetail) => {
  const toastProses = toast.loading("Tunggu Sebentar...", { autoClose: false });
  axios
    .put(`/api/setting/users/${values.id}`, values)
    .then((res) => {
      setDetail({ ...values });
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
  nama_admin: yup.string("Masukan Nama").required("Harus Diisi"),
  telp_admin: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email_admin: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
  alamat_admin: yup.string().required("Alamat Harus Diisi"),
  username: yup.string().required("Username Harus Diisi"),
  passwordBaru: yup.string().required("Password Harus Diisi"),
  passwordConfirm: yup
    .string()
    .required("Konfirmasi Password Harus Diisi")
    .oneOf([yup.ref("passwordBaru"), null], "Passwords Tidak Sama"),
});

function UserUpdate({ profile, setDetail }) {
  const isDisabled = Boolean(!profile.editable);
  // email awalnya tidak ada jadi diberi kondisi
  const formik = useFormik({
    initialValues: {
      ...profile,
      email_admin: profile.email_admin ? profile.email_admin : "",
      passwordBaru: "",
      passwordConfirm: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, setDetail),
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Ganti Data User
          </Typography>

          <Box>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                disabled={isDisabled}
                fullWidth
                required
                margin="normal"
                label="Nama"
                name="nama"
                value={formik.values.nama_admin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.nama_admin && Boolean(formik.errors.nama_admin)
                }
                helperText={
                  formik.touched.nama_admin && formik.errors.nama_admin
                }
              />
              <TextField
                disabled={isDisabled}
                fullWidth
                required
                margin="normal"
                label="HP / Telp"
                name="telp_admin"
                value={formik.values.telp_admin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.telp_admin && Boolean(formik.errors.telp_admin)
                }
                helperText={
                  formik.touched.telp_admin && formik.errors.telp_admin
                }
              />
              <TextField
                disabled={isDisabled}
                fullWidth
                required
                margin="normal"
                type="email"
                label="Email"
                name="email_admin"
                value={formik.values.email_admin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.email_admin &&
                  Boolean(formik.errors.email_admin)
                }
                helperText={
                  formik.touched.email_admin && formik.errors.email_admin
                }
              />
              <TextField
                disabled={isDisabled}
                fullWidth
                required
                multiline
                rows={3}
                margin="normal"
                label="Alamat"
                name="alamat_admin"
                value={formik.values.alamat_admin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.alamat_admin &&
                  Boolean(formik.errors.alamat_admin)
                }
                helperText={
                  formik.touched.alamat_admin && formik.errors.alamat_admin
                }
              />
              <TextField
                disabled={isDisabled}
                fullWidth
                required
                margin="normal"
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
                disabled={isDisabled}
                fullWidth
                margin="normal"
                required
                type="password"
                label="Password"
                name="passwordBaru"
                value={formik.values.passwordBaru}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.passwordBaru &&
                  Boolean(formik.errors.passwordBaru)
                }
                helperText={
                  formik.touched.passwordBaru && formik.errors.passwordBaru
                }
              />
              <TextField
                disabled={isDisabled}
                fullWidth
                margin="normal"
                required
                type="password"
                label="Konfirmasi Password"
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
              {!isDisabled && (
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<EditIcon />}
                >
                  Update
                </Button>
              )}
            </form>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default UserUpdate;
