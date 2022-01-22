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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const handleSubmit = (values, props) => {
  const postData = {
    ...values,
    email: props.detail.email,
    tiket_number: props.detail.tiket_number,
  };
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/permohonan/onlines/${values.id_permohonan}/response`, postData)
    .then((res) => {
      props.setDetail({ ...props.detail, reg_number: values.reg_number });
      props.setResponse({ ...props.response, ...values });
      setTimeout(() => props.onClose(), 2000);
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
  reg_number: yup.string().required("Harus Diisi"),
  status: yup.string().required("Harus Diisi"),
  alasan: yup.string().when("status", {
    is: (status) =>
      status === "Diberikan Sebagian" || status === "Tidak Dapat Diberikan",
    then: yup
      .string()
      .required("Harus diisi jika tidak dapat diberikan seluruhnya"),
    otherwise: yup.string(),
  }),
  waktu: yup.string().when("status", {
    is: (status) => status !== "Diproses",
    then: yup.string().required("Waktu Pelayanan Harus Diisi"),
    otherwise: yup.string(),
  }),
  response: yup.string().required("Response Harus Diisi"),
});

function ResponseDialog(props) {
  useEffect(() => {
    if (props.open) formik.resetForm();
  }, [props.open, formik]);

  const formik = useFormik({
    initialValues: {
      current_reg_number: props.detail.reg_number
        ? props.detail.reg_number
        : "",
      reg_number: props.detail.reg_number ? props.detail.reg_number : "",
      id: props.response.id ? props.response.id : "",
      id_permohonan: props.detail.id ? props.detail.id : "",
      status: props.response.status ? props.response.status : "",
      alasan: props.response.alasan ? props.response.alasan : "",
      waktu: props.response.waktu ? props.response.waktu : "",
      response: props.response.waktu ? props.response.response : "",
      mailed: true,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, props),
  });
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={props.fullScreen}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Response {props.detail.tiket_number}</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            required
            margin="normal"
            label="Nomor Registrasi"
            name="reg_number"
            value={formik.values.reg_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.reg_number && Boolean(formik.errors.reg_number)
            }
            helperText={formik.touched.reg_number && formik.errors.reg_number}
          />
          <FormControl fullWidth error={Boolean(formik.errors.status)}>
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
              <MenuItem value="Diberikan Sebagian">Diberikan Sebagian</MenuItem>
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
              sx={{ mt: 3 }}
              error={Boolean(formik.errors.alasan)}
            >
              <InputLabel>Alasan Tidak Diberikan Seluruhnya</InputLabel>
              <Select
                name="alasan"
                label="Alasan Tidak DIberikan Seluruhnya"
                value={formik.values.alasan}
                onChange={formik.handleChange}
              >
                <MenuItem value="Dikecualikan">Dikecualikan</MenuItem>
                <MenuItem value="Tidak Dikuasai">Tidak Dikuasai</MenuItem>
              </Select>
              <FormHelperText>{formik.errors.alasan}</FormHelperText>
            </FormControl>
          )}
          {formik.values.status !== "Diproses" && (
            <TextField
              fullWidth
              required
              margin="normal"
              label="Waktu Proses (Hari)"
              name="waktu"
              value={formik.values.waktu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.waktu && Boolean(formik.errors.waktu)}
              helperText={formik.touched.waktu && formik.errors.waktu}
            />
          )}
          <TextField
            fullWidth
            required
            multiline
            margin="normal"
            label="Response"
            name="response"
            value={formik.values.response}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.response && Boolean(formik.errors.response)}
            helperText={formik.touched.response && formik.errors.response}
          />

          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Kirim Email Kepada Pemohon"
              name="mailed"
              onChange={formik.handleChange}
            />
          </FormGroup>
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

export default ResponseDialog;
