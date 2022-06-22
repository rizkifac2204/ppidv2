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

const handleSubmit = (values, setProfile, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...", { autoClose: false });
  axios
    .put(`/api/profile`, values)
    .then((res) => {
      setProfile(() => values);
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
  nama_admin: yup.string("Masukan Nama").required("Harus Diisi"),
  telp_admin: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email_admin: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
  alamat_admin: yup.string().required("Alamat Harus Diisi"),
  username: yup.string().required("Username Harus Diisi"),
  passwordConfirm: yup.string().required("Password Harus Diisi"),
});

function ProfileForm({ profile, setProfile }) {
  const formik = useFormik({
    initialValues: { ...profile, passwordConfirm: "" },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setProfile, setSubmitting),
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
                name="nama_admin"
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
                fullWidth
                required
                margin="normal"
                placeholder="Telp"
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
                fullWidth
                required
                margin="normal"
                type="email"
                placeholder="Email"
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
                fullWidth
                required
                multiline
                rows={3}
                margin="normal"
                placeholder="Alamat"
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
              <Button
                disabled={formik.isSubmitting}
                type="submit"
                variant="contained"
                endIcon={<EditIcon />}
              >
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
