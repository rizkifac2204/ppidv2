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

const handleSubmit = (values, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...", { autoClose: false });
  axios
    .put(`/api/profile/gantiPassword`, values)
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
  lama: yup.string().required("Password Lama Harus Diisi"),
  baru: yup.string().required("Password Baru Harus Diisi"),
  confirm: yup
    .string()
    .required("Konfirmasi Password Harus Diisi")
    .oneOf([yup.ref("baru"), null], "Passwords tidak sama"),
});

function ProfilePassword({ profile }) {
  const formik = useFormik({
    initialValues: { lama: "", baru: "", confirm: "" },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values, setSubmitting),
  });

  return (
    <>
      <Card>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Ganti Password
          </Typography>

          <Box>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                required
                type="password"
                margin="normal"
                placeholder="Password Lama"
                label="Password Lama"
                name="lama"
                value={formik.values.lama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lama && Boolean(formik.errors.lama)}
                helperText={formik.touched.lama && formik.errors.lama}
              />
              <TextField
                fullWidth
                required
                type="password"
                margin="normal"
                placeholder="Password Baru"
                label="Password Baru"
                name="baru"
                value={formik.values.baru}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.baru && Boolean(formik.errors.baru)}
                helperText={formik.touched.baru && formik.errors.baru}
              />

              <TextField
                fullWidth
                required
                type="password"
                margin="normal"
                placeholder="Konfirmasi Password Baru"
                label="Konfirmasi Password Baru"
                name="confirm"
                value={formik.values.confirm}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirm && Boolean(formik.errors.confirm)}
                helperText={formik.touched.confirm && formik.errors.confirm}
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

export default ProfilePassword;
