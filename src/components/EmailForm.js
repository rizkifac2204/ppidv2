import { useEffect, useRef } from "react";
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
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
// wysiwyg
import { Editor } from "@tinymce/tinymce-react";

const handleSubmit = (values, props, editorRef) => {
  const editor = editorRef.current.getContent();
  if (!editor) return toast.info("Isi Email Masih Kosong");
  values = { ...values, isi: editor };
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/subscriber/email`, values)
    .then((res) => {
      setTimeout(() => props.onClose(), 2000);
      props.router.push({
        pathname: props.router.pathname,
        query: props.router.query,
      });
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
  penerima: yup.string().required("Harus Dipilih"),
  subjek: yup.string().required("Harus Diisi"),
  list_penerima: yup.array().when("penerima", {
    is: (penerima) => penerima === "Select",
    then: yup.array().min(1, "Minimal Pilih Salah Satu Penerima"),
    otherwise: yup.array(),
  }),
});

function EmailForm(props) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!props.open) {
      formik.resetForm();
    }
  }, [props.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const formik = useFormik({
    initialValues: {
      id: props.detail.id ? props.detail.id : "",
      penerima: props.detail.penerima ? props.detail.penerima : "",
      subjek: props.detail.subjek ? props.detail.subjek : "",
      list_penerima: [],
      send: false,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, props, editorRef),
  });

  function handleSubmitClick(send, formik) {
    formik.setFieldValue("send", send, formik.handleSubmit());
  }

  useEffect(() => {
    formik.setFieldValue("list_penerima", []);
  }, [formik.values.penerima]); // eslint-disable-line react-hooks/exhaustive-deps

  if (props.subscriber.length === 0) {
    return (
      <Dialog open={props.open} onClose={props.onClose} fullScreen={false}>
        <DialogTitle>Tidak Memiliki Subscriber</DialogTitle>
        <DialogActions>
          <Button onClick={props.onClose} type="button">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={true}>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <FormControl
            fullWidth
            error={formik.touched.penerima && Boolean(formik.errors.penerima)}
          >
            <InputLabel>Penerima *</InputLabel>
            <Select
              name="penerima"
              label="Penerima *"
              value={formik.values.penerima}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <MenuItem value="All">Semua Subscriber</MenuItem>
              <MenuItem value="Select">Pilih Dari Daftar</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.penerima && formik.errors.penerima}
            </FormHelperText>
          </FormControl>
          {formik.values.penerima === "Select" && (
            <Chip label={formik.values.list_penerima.length + ` Penerima`} />
          )}
          {formik.values.penerima === "All" && (
            <Chip label={props.subscriber.length + ` Penerima`} />
          )}
          {formik.values.penerima === "Select" && (
            <FormControl
              fullWidth
              sx={{ mt: 2 }}
              error={
                formik.touched.list_penerima &&
                Boolean(formik.errors.list_penerima)
              }
            >
              <InputLabel id="demo-multiple-chip-label">
                Pilih Penerima *
              </InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                name="list_penerima"
                label="Pilih Penerima *"
                value={formik.values.list_penerima}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                      width: 250,
                    },
                  },
                }}
              >
                {props.subscriber.map((item) => (
                  <MenuItem key={item.id} value={item.email}>
                    <Checkbox
                      checked={
                        formik.values.list_penerima.indexOf(item.email) > -1
                      }
                    />
                    <ListItemText primary={item.email} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {formik.touched.list_penerima && formik.errors.list_penerima}
              </FormHelperText>
            </FormControl>
          )}
          <TextField
            sx={{ mb: 2 }}
            fullWidth
            required
            margin="normal"
            label="Subjek"
            name="subjek"
            value={formik.values.subjek}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subjek && Boolean(formik.errors.subjek)}
            helperText={formik.touched.subjek && formik.errors.subjek}
          />
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            apiKey={process.env.tynimceAPI}
            initialValue={props.detail.isi ? props.detail.isi : ""}
            init={{
              height: 400,
              // image_list: [
              //   { title: "My page 1", value: "https://www.tiny.cloud" },
              //   { title: "My page 2", value: "http://www.moxiecode.com" },
              // ],
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste wordcount",
              ],
              toolbar:
                "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={(e) => handleSubmitClick(true, formik)}
          >
            Kirim dan Tutup
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmitClick(false, formik)}
          >
            Draft dan Tutup
          </Button>
          <Button type="button" onClick={props.onClose}>
            Buang
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EmailForm;
