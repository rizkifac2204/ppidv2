import axios from "axios";
import { toast } from "react-toastify";
import { useFormik, getIn, useFormikContext } from "formik";
import * as yup from "yup";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
// ICONS
import AddTaskIcon from "@mui/icons-material/AddTask";

const handleSubmit = (values) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/setting/users`, values)
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
    });
};

const validationSchema = yup.object({
  level: yup.number().required("Harus Diisi"),
  nama: yup.string().required("Harus Diisi"),
  telp: yup.string().required("Harus Diisi"),
  email: yup.string().email("Email Tidak Valid").required("Harus Diisi"),
  alamat: yup.string().required("Alamat Harus Diisi"),
  id_prov: yup.number().when("level", {
    is: (level) => level > 2,
    then: yup.number().required("Harus diisi"),
    otherwise: yup.number(),
  }),
  id_kabkot: yup.number().when("level", {
    is: (level) => level > 3,
    then: yup.number().required("Harus diisi"),
    otherwise: yup.number(),
  }),
  username: yup.string().required("Harus Diisi"),
  password: yup.string().required("Password Harus Diisi"),
  passwordConfirm: yup
    .string()
    .required("Konfirmasi Password Harus Diisi")
    .oneOf([yup.ref("password"), null], "Passwords Tidak Sama"),
});

function AddUsers() {
  const { data: session } = useSession();
  const [initialValues, setInitialValues] = useState({
    level: "",
    nama: "",
    telp: "",
    email: "",
    alamat: "",
    id_prov: "",
    id_kabkot: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [levels, setLevels] = useState([]);
  const [provinsis, setProvinsis] = useState([]);
  const [kabkots, setKabkots] = useState([]);

  useEffect(() => {
    const fetchLevel = () => {
      axios
        .get(`/api/setting/levels`)
        .then((res) => {
          setLevels(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchLevel();
  }, []);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  const fetchProv = () => {
    axios
      .get(`/api/setting/wilayah/provinsis`)
      .then((res) => {
        setProvinsis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchKabkot = () => {
    axios
      .get(`/api/setting/wilayah/provinsis/` + formik.values.id_prov)
      .then((res) => {
        setKabkots(res.data.kabkot);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} gutterBottom>
          Tambah Permohonan Offline
        </Typography>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  sx={{ mt: 1 }}
                  error={formik.touched.level && Boolean(formik.errors.level)}
                >
                  <InputLabel>Level *</InputLabel>
                  <Select
                    name="level"
                    label="Level *"
                    value={formik.values.level}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("id_prov", "");
                      formik.setFieldValue("id_kabkot", "");
                      if (e.target.value > 2 && provinsis.length === 0) {
                        fetchProv();
                      }
                    }}
                  >
                    {levels.length !== 0 &&
                      levels.map((item, idx) => {
                        if (item.id > session.user.level)
                          return (
                            <MenuItem key={idx} value={item.id}>
                              {item.nama_level}
                            </MenuItem>
                          );
                      })}
                  </Select>
                  <FormHelperText>{formik.errors.level}</FormHelperText>
                </FormControl>

                <TextField
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
                  fullWidth
                  required
                  margin="normal"
                  label="Telp/HP"
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
                  label="Alamat"
                  name="alamat"
                  value={formik.values.alamat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.alamat && Boolean(formik.errors.alamat)}
                  helperText={formik.touched.alamat && formik.errors.alamat}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                {formik.values.level > 2 && (
                  <FormControl
                    fullWidth
                    sx={{ mt: 1 }}
                    error={
                      formik.touched.id_prov && Boolean(formik.errors.id_prov)
                    }
                  >
                    <InputLabel>Provinsi *</InputLabel>
                    <Select
                      name="id_prov"
                      label="Provinsi *"
                      value={formik.values.id_prov}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue("id_kabkot", "");
                        if (formik.values.level > 3) {
                          fetchKabkot();
                        }
                      }}
                    >
                      <MenuItem value="">--Pilih--</MenuItem>
                      {provinsis.length !== 0 &&
                        provinsis.map((item, idx) => (
                          <MenuItem key={idx} value={item.id}>
                            {item.provinsi}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{formik.errors.id_prov}</FormHelperText>
                  </FormControl>
                )}

                {formik.values.level > 3 && (
                  <FormControl
                    fullWidth
                    sx={{ mt: 1 }}
                    error={
                      formik.touched.id_kabkot &&
                      Boolean(formik.errors.id_kabkot)
                    }
                  >
                    <InputLabel>Kabupaten/Kota *</InputLabel>
                    <Select
                      name="id_kabkot"
                      label="Kabupaten/Kota *"
                      value={formik.values.id_kabkot}
                      onChange={formik.handleChange}
                    >
                      {kabkots.length !== 0 &&
                        kabkots.map((item, idx) => (
                          <MenuItem key={idx} value={item.id}>
                            {item.kabupaten}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{formik.errors.id_kabkot}</FormHelperText>
                  </FormControl>
                )}

                <TextField
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
                  fullWidth
                  margin="normal"
                  required
                  type="password"
                  label="Password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />

                <TextField
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
              </Grid>

              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<AddTaskIcon />}
                >
                  Simpan
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </CardContent>
    </Card>
  );
}

AddUsers.auth = true;
AddUsers.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/users",
    title: "Users",
  },
  {
    path: "/admin/setting/users/add",
    title: "Tambah Users",
  },
];
export default AddUsers;
