import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
// MUI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const handleSubmit = (values, props) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/subscriber`, values)
    .then((res) => {
      props.fecthSubscriber();
      setTimeout(() => props.onClose(), 1000);
      toast.update(toastProses, {
        render: res.data.message,
        type: res.data.type,
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
  nama_subscriber: yup.string(),
  email_subscriber: yup
    .string("Masukan Email")
    .email("Email Tidak Valid")
    .required("Email Harus Diisi"),
});

function SubscriberFormAdd(props) {
  const formik = useFormik({
    initialValues: {
      nama_subscriber: "",
      email_subscriber: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, props),
  });

  useEffect(() => {
    if (props.open) formik.resetForm();
  }, [props.open]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Tambah Subscriber Baru</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            margin="normal"
            label="Nama"
            name="nama_subscriber"
            value={formik.values.nama_subscriber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.nama_subscriber &&
              Boolean(formik.errors.nama_subscriber)
            }
            helperText={
              formik.touched.nama_subscriber && formik.errors.nama_subscriber
            }
          />
          <TextField
            fullWidth
            required
            type="email"
            margin="normal"
            label="Email"
            name="email_subscriber"
            value={formik.values.email_subscriber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.email_subscriber &&
              Boolean(formik.errors.email_subscriber)
            }
            helperText={
              formik.touched.email_subscriber && formik.errors.email_subscriber
            }
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Simpan dan Tutup</Button>
          <Button onClick={props.onClose} type="button">
            Tutup
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default SubscriberFormAdd;
