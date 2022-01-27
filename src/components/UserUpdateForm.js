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
  const toastProses = toast.loading("Tunggu Sebentar...");
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
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  telp: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
  alamat: yup.string().required("Alamat Harus Diisi"),
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
      email: profile.email ? profile.email : "",
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
            Ganti Data Profile
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
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama && Boolean(formik.errors.nama)}
                helperText={formik.touched.nama && formik.errors.nama}
              />
              <TextField
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
