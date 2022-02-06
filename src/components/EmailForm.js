import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import dynamic from "next/dynamic";
// MUI
import { useTheme } from "@mui/material/styles";
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
// wysiwyg
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// );

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};
function getStyles(email, arr, theme) {
  return {
    fontWeight:
      arr.indexOf(email) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const handleSubmit = (values, props) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/subscriber/email`, values)
    .then((res) => {
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
  penerima: yup.string().required("Harus Dipilih"),
  subjek: yup.string().required("Harus Diisi"),
  isi: yup.string().required("Harus Diisi"),
  list_penerima: yup.array().when("penerima", {
    is: (penerima) => penerima === "Select",
    then: yup.array().min(1, "Minimal Pilih Salah Satu Penerima"),
    otherwise: yup.array(),
  }),
});

function EmailForm(props) {
  const theme = useTheme();
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const formik = useFormik({
    initialValues: {
      id: props.fromDraft.id ? props.fromDraft.id : "",
      penerima: props.fromDraft.penerima ? props.fromDraft.penerima : "",
      subjek: props.fromDraft.subjek ? props.fromDraft.subjek : "",
      isi: props.fromDraft.isi ? props.fromDraft.isi : "",
      list_penerima: [],
      send: false,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, props),
  });

  useEffect(() => {
    if (!props.open) {
      formik.resetForm();
      // setEditorState(EditorState.createEmpty());
    }
  }, [props.open]);

  // const onEditorStateChange = (editorState) => {
  //   setEditorState(editorState);
  // };

  function handleButtonClick(send, formik) {
    formik.setFieldValue("send", send, formik.handleSubmit());
  }

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

  // useEffect(() => {
  //   formik.setFieldValue("isi", convertToRaw(editorState.getCurrentContent()));
  // }, [editorState]);

  return (
    <Dialog open={props.open} onClose={props.onClose} fullScreen={true}>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <FormControl fullWidth error={Boolean(formik.errors.penerima)}>
            <InputLabel>Penerima *</InputLabel>
            <Select
              name="penerima"
              label="Penerima *"
              value={formik.values.penerima}
              onChange={formik.handleChange}
              onBlur={(e) => formik.setFieldValue("list_penerima", [])}
            >
              <MenuItem value="All">Semua Subscriber</MenuItem>
              <MenuItem value="Select">Pilih Dari Daftar</MenuItem>
            </Select>
            <FormHelperText>{formik.errors.penerima}</FormHelperText>
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
              error={Boolean(formik.errors.list_penerima)}
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
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {props.subscriber.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.email}
                    style={getStyles(
                      item.email,
                      formik.values.list_penerima,
                      theme
                    )}
                  >
                    <Checkbox
                      checked={
                        formik.values.list_penerima.indexOf(item.email) > -1
                      }
                    />
                    <ListItemText primary={item.email} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formik.errors.list_penerima}</FormHelperText>
            </FormControl>
          )}
          <TextField
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
          <TextField
            fullWidth
            multiline
            rows={3}
            required
            margin="normal"
            label="Isi"
            name="isi"
            value={formik.values.isi}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.isi && Boolean(formik.errors.isi)}
            helperText={formik.touched.isi && formik.errors.isi}
          />
          {/* <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
            placeholder="Tulis Email Disini ..."
          /> */}
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            onClick={(e) => handleButtonClick(true, formik)}
          >
            Kirim dan Tutup
          </Button>
          <Button
            type="button"
            onClick={(e) => handleButtonClick(false, formik)}
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
