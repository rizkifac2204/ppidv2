import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
// MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const handleSubmit = (values, recaptchaRef, afterSubmit, setResponse) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi");
    return;
  }
  setResponse(false);

  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/public/survey`, values)
    .then((res) => {
      afterSubmit(res);
      toast.update(toastProses, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      console.log(err);
      toast.update(toastProses, {
        render: err.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .then(() => {
      if (recaptchaRef.current) recaptchaRef.current.reset();
    });
};

const validationSchema = yup.object({
  kepada: yup.string().required("Harus Diisi"),
  id_prov: yup.number().when("kepada", {
    is: (kepada) => kepada !== "Bawaslu Republik Indonesia",
    then: yup.number().required("Provinsi Harus Dipilih"),
    otherwise: yup.number(),
  }),
  id_kabkot: yup.number().when("kepada", {
    is: (kepada) => kepada === "Bawaslu",
    then: yup.number().required("Kabupaten/Kota Harus Diisi"),
    otherwise: yup.number(),
  }),
  nama: yup.string().required("Harus Diisi"),
  jenis_kelamin: yup.string().required("Harus Diisi"),
  pendidikan: yup.string().required("Telp Harus Diisi"),
  email: yup.string().email("Email Tidak Valid").required("Harus Diisi"),
  pekerjaan: yup.string().required("Harus Diisi"),
  alamat: yup.string().required("Harus Diisi"),
  satu: yup.string().required("Harus Diisi"),
  dua: yup.string().required("Harus Diisi"),
  tiga: yup.string().required("Harus Diisi"),
  empat: yup.string().required("Harus Diisi"),
  lima: yup.string().required("Harus Diisi"),
  enam: yup.string().required("Harus Diisi"),
  tujuh: yup.string().required("Harus Diisi"),
  delapan: yup.string().required("Harus Diisi"),
  sembilan: yup.string().required("Harus Diisi"),
  sepuluh: yup.string().required("Harus Diisi"),
  saran: yup.string().required("Harus Diisi"),
});

function Survey() {
  const [response, setResponse] = useState(false);
  const [provinsis, setProvinsis] = useState([]);
  const [kabkots, setKabkots] = useState([]);
  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);

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

  const fetchKabkot = (id) => {
    axios
      .get(`/api/setting/wilayah/provinsis/` + id)
      .then((res) => {
        setKabkots(res.data.kabkot);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      kepada: "",
      id_prov: "",
      id_kabkot: "",
      nama: "",
      jenis_kelamin: "",
      pendidikan: "",
      email: "",
      pekerjaan: "",
      alamat: "",
      satu: "",
      dua: "",
      tiga: "",
      empat: "",
      lima: "",
      enam: "",
      tujuh: "",
      delapan: "",
      sembilan: "",
      sepuluh: "",
      saran: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) =>
      handleSubmit(values, recaptchaRef, afterSubmit, setResponse),
  });

  const captchaChange = () => {
    toast.dismiss();
  };

  const afterSubmit = (res) => {
    setResponse(true);
    formik.resetForm();
    answerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!formik.values.kepada) return;
    formik.setFieldValue("id_prov", "");
    formik.setFieldValue("id_kabkot", "");
    if (
      formik.values.kepada !== "Bawaslu Republik Indonesia" &&
      provinsis.length === 0
    )
      fetchProv();
  }, [formik.values.kepada]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    formik.setFieldValue("id_kabkot", "");
    if (!formik.values.id_prov) return;
    if (formik.values.kepada === "Bawaslu") fetchKabkot(formik.values.id_prov);
  }, [formik.values.id_prov]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="block-form">
      <h2>Formulir Survey Layanan Permohoan Informasi</h2>
      <p>
        Isi Formulir untuk melakukan Permohonan Informasi <br />
        <strong>Pelayanan Kantor</strong> pukul 08:00 AM s.d 16:00 PM. Kamu juga
        dapat melakukan permohonan dengan menghubungi 08777.
      </p>
      <div style={{ marginTop: "20px" }}>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            {/* kepada */}
            <div className="col-xs-12">
              <FormControl
                fullWidth
                error={formik.touched.kepada && Boolean(formik.errors.kepada)}
              >
                <InputLabel>Penerima *</InputLabel>
                <Select
                  name="kepada"
                  label="Penerima"
                  value={formik.values.kepada}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="Bawaslu Republik Indonesia">
                    <p>Bawaslu Republik Indonesia</p>
                  </MenuItem>
                  <MenuItem value="Bawaslu Provinsi">
                    <p>Bawaslu Provinsi</p>
                  </MenuItem>
                  <MenuItem value="Bawaslu">
                    <p>Bawaslu Kabupaten/Kota</p>
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {formik.touched.kepada && formik.errors.kepada}
                </FormHelperText>
              </FormControl>
            </div>
            {/* provinsi  */}
            {formik.values.kepada !== "Bawaslu Republik Indonesia" && (
              <div className="col-xs-12 col-sm-6">
                <FormControl
                  required
                  sx={{ mt: 2 }}
                  fullWidth
                  error={
                    formik.touched.id_prov && Boolean(formik.errors.id_prov)
                  }
                >
                  <InputLabel>
                    <p>Provinsi *</p>
                  </InputLabel>
                  <Select
                    name="id_prov"
                    label={<p>Provinsi</p>}
                    value={formik.values.id_prov}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">--Pilih--</MenuItem>
                    {provinsis.length !== 0 &&
                      provinsis.map((item, idx) => (
                        <MenuItem key={idx} value={item.id}>
                          <p>{item.provinsi}</p>
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.id_prov && formik.errors.id_prov}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
            {/* kabkot */}
            {formik.values.kepada === "Bawaslu" && (
              <div className="col-xs-12 col-sm-6">
                <FormControl
                  required
                  sx={{ mt: 2 }}
                  fullWidth
                  error={
                    formik.touched.id_kabkot && Boolean(formik.errors.id_kabkot)
                  }
                >
                  <InputLabel>Kabupaten/Kota *</InputLabel>
                  <Select
                    required
                    name="id_kabkot"
                    label="Kabupaten/Kota *"
                    value={formik.values.id_kabkot}
                    onChange={formik.handleChange}
                  >
                    {kabkots.length !== 0 &&
                      kabkots.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.kabupaten}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.id_kabkot && formik.errors.id_kabkot}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
            {/* nama */}
            <div className="col-xs-12 col-sm-6">
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
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* jenis_kelamin  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={
                  formik.touched.jenis_kelamin &&
                  Boolean(formik.errors.jenis_kelamin)
                }
                variant="standard"
              >
                <RadioGroup
                  aria-label="jenis_kelamin"
                  name="jenis_kelamin"
                  value={formik.values.jenis_kelamin}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Laki-laki"
                    control={<Radio />}
                    label={<p>Laki-laki</p>}
                  />
                  <FormControlLabel
                    value="Perempuan"
                    control={<Radio />}
                    label={<p>Perempuan</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.jenis_kelamin && formik.errors.jenis_kelamin}
                </FormHelperText>
              </FormControl>
            </div>
            {/* pendidikan */}
            <div className="col-xs-12 col-sm-6">
              <TextField
                fullWidth
                required
                margin="normal"
                label="Pendidikan"
                name="pendidikan"
                value={formik.values.pendidikan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.pendidikan && Boolean(formik.errors.pendidikan)
                }
                helperText={
                  formik.touched.pendidikan && formik.errors.pendidikan
                }
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* email  */}
            <div className="col-xs-12 col-sm-6">
              <TextField
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
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* pekerjaan  */}
            <div className="col-xs-12 col-sm-6">
              <TextField
                fullWidth
                required
                margin="normal"
                label="Pekerjaan"
                name="pekerjaan"
                value={formik.values.pekerjaan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.pekerjaan && Boolean(formik.errors.pekerjaan)
                }
                helperText={formik.touched.pekerjaan && formik.errors.pekerjaan}
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* alamat  */}
            <div className="col-xs-12">
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                margin="normal"
                label="Alamat"
                name="alamat"
                value={formik.values.alamat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alamat && Boolean(formik.errors.alamat)}
                helperText={formik.touched.alamat && formik.errors.alamat}
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* satu  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.satu && Boolean(formik.errors.satu)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kesesuaian persyaratan
                    permohonan informasi publik dengan jenis pelayanannya?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="satu"
                  name="satu"
                  value={formik.values.satu}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Sesuai"
                    control={<Radio />}
                    label={<p>Tidak Sesuai</p>}
                  />
                  <FormControlLabel
                    value="Kurang Sesuai"
                    control={<Radio />}
                    label={<p>Kurang Sesuai</p>}
                  />
                  <FormControlLabel
                    value="Sesuai"
                    control={<Radio />}
                    label={<p>Sesuai</p>}
                  />
                  <FormControlLabel
                    value="Sangat Sesuai"
                    control={<Radio />}
                    label={<p>Sangat Sesuai</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.satu && formik.errors.satu}
                </FormHelperText>
              </FormControl>
            </div>
            {/* dua  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.dua && Boolean(formik.errors.dua)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kemudahan prosedur
                    pelayanan permohonan informasi publik di Bawaslu?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="dua"
                  name="dua"
                  value={formik.values.dua}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Mudah"
                    control={<Radio />}
                    label={<p>Tidak Mudah</p>}
                  />
                  <FormControlLabel
                    value="Kurang Mudah"
                    control={<Radio />}
                    label={<p>Kurang Mudah</p>}
                  />
                  <FormControlLabel
                    value="Mudah"
                    control={<Radio />}
                    label={<p>Mudah</p>}
                  />
                  <FormControlLabel
                    value="Sangat Mudah"
                    control={<Radio />}
                    label={<p>Sangat Mudah</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.dua && formik.errors.dua}
                </FormHelperText>
              </FormControl>
            </div>
            {/* tiga  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.tiga && Boolean(formik.errors.tiga)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kecepatan waktu petugas
                    dalam memberikan pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="tiga"
                  name="tiga"
                  value={formik.values.tiga}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Cepat"
                    control={<Radio />}
                    label={<p>Tidak Cepat</p>}
                  />
                  <FormControlLabel
                    value="Kurang Cepat"
                    control={<Radio />}
                    label={<p>Kurang Cepat</p>}
                  />
                  <FormControlLabel
                    value="Cepat"
                    control={<Radio />}
                    label={<p>Cepat</p>}
                  />
                  <FormControlLabel
                    value="Sangat Cepat"
                    control={<Radio />}
                    label={<p>Sangat Cepat</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.tiga && formik.errors.tiga}
                </FormHelperText>
              </FormControl>
            </div>
            {/* empat  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.empat && Boolean(formik.errors.empat)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kewajaran biaya/tarif
                    dalam pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="empat"
                  name="empat"
                  value={formik.values.empat}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Mahal"
                    control={<Radio />}
                    label={<p>Tidak Mahal</p>}
                  />
                  <FormControlLabel
                    value="Cukup Mahal"
                    control={<Radio />}
                    label={<p>Cukup Mahal</p>}
                  />
                  <FormControlLabel
                    value="Mahal"
                    control={<Radio />}
                    label={<p>Mahal</p>}
                  />
                  <FormControlLabel
                    value="Sangat Mahal"
                    control={<Radio />}
                    label={<p>Sangat Mahal</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.empat && formik.errors.empat}
                </FormHelperText>
              </FormControl>
            </div>
            {/* lima  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.lima && Boolean(formik.errors.lima)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kesesuaian produk
                    pelayanan antara yang tercantum dalam standar pelayanan
                    dengan hasil yang diberikan?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="lima"
                  name="lima"
                  value={formik.values.lima}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Sesuai"
                    control={<Radio />}
                    label={<p>Tidak Sesuai</p>}
                  />
                  <FormControlLabel
                    value="Kurang Sesuai"
                    control={<Radio />}
                    label={<p>Kurang Sesuai</p>}
                  />
                  <FormControlLabel
                    value="Sesuai"
                    control={<Radio />}
                    label={<p>Sesuai</p>}
                  />
                  <FormControlLabel
                    value="Sangat Sesuai"
                    control={<Radio />}
                    label={<p>Sangat Sesuai</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.lima && formik.errors.lima}
                </FormHelperText>
              </FormControl>
            </div>
            {/* enam  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.enam && Boolean(formik.errors.enam)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kompetensi/kemampuan
                    petugas dalam pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="enam"
                  name="enam"
                  value={formik.values.enam}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Kompeten"
                    control={<Radio />}
                    label={<p>Tidak Kompeten</p>}
                  />
                  <FormControlLabel
                    value="Kurang Kompeten"
                    control={<Radio />}
                    label={<p>Kurang Kompeten</p>}
                  />
                  <FormControlLabel
                    value="Kompeten"
                    control={<Radio />}
                    label={<p>Kompeten</p>}
                  />
                  <FormControlLabel
                    value="Sangat Kompeten"
                    control={<Radio />}
                    label={<p>Sangat Kompeten</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.enam && formik.errors.enam}
                </FormHelperText>
              </FormControl>
            </div>
            {/* tujuh  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.tujuh && Boolean(formik.errors.tujuh)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang perilaku petugas dalam
                    pelayanan informasi publik terkait kesopanan dan keramahan?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="tujuh"
                  name="tujuh"
                  value={formik.values.tujuh}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Sopan dan Ramah"
                    control={<Radio />}
                    label={<p>Tidak Sopan dan Ramah</p>}
                  />
                  <FormControlLabel
                    value="Kurang Sopan dan Ramah"
                    control={<Radio />}
                    label={<p>Kurang Sopan dan Ramah</p>}
                  />
                  <FormControlLabel
                    value="Sopan dan Ramah"
                    control={<Radio />}
                    label={<p>Sopan dan Ramah</p>}
                  />
                  <FormControlLabel
                    value="Sangat Sopan dan Ramah"
                    control={<Radio />}
                    label={<p>Sangat Sopan dan Ramah</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.tujuh && formik.errors.tujuh}
                </FormHelperText>
              </FormControl>
            </div>
            {/* delapan  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.delapan && Boolean(formik.errors.delapan)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kualitas sarana dan
                    prasarana pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="delapan"
                  name="delapan"
                  value={formik.values.delapan}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Buruk"
                    control={<Radio />}
                    label={<p>Buruk</p>}
                  />
                  <FormControlLabel
                    value="Cukup"
                    control={<Radio />}
                    label={<p>Cukup</p>}
                  />
                  <FormControlLabel
                    value="Baik"
                    control={<Radio />}
                    label={<p>Baik</p>}
                  />
                  <FormControlLabel
                    value="Sangat Baik"
                    control={<Radio />}
                    label={<p>Sangat Baik</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.delapan && formik.errors.delapan}
                </FormHelperText>
              </FormControl>
            </div>
            {/* sembilan  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={
                  formik.touched.sembilan && Boolean(formik.errors.sembilan)
                }
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang penanganan pengaduan
                    pengguna layanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="sembilan"
                  name="sembilan"
                  value={formik.values.sembilan}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Ada"
                    control={<Radio />}
                    label={<p>Tidak Ada</p>}
                  />
                  <FormControlLabel
                    value="Ada Tetapi Tidak Berfungsi"
                    control={<Radio />}
                    label={<p>Ada Tetapi Tidak Berfungsi</p>}
                  />
                  <FormControlLabel
                    value="Berfungsi Tetapi Kurang Maksimal"
                    control={<Radio />}
                    label={<p>Berfungsi Tetapi Kurang Maksimal</p>}
                  />
                  <FormControlLabel
                    value="Dikelola Dengan Baik"
                    control={<Radio />}
                    label={<p>Dikelola Dengan Baik</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.sembilan && formik.errors.sembilan}
                </FormHelperText>
              </FormControl>
            </div>
            {/* sepuluh  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.sepuluh && Boolean(formik.errors.sepuluh)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang tingkat kepuasan terhadap
                    keseluruhan pelayanan informasi publik di Bawaslu?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="sepuluh"
                  name="sepuluh"
                  value={formik.values.sepuluh}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="Tidak Puas"
                    control={<Radio />}
                    label={<p>Tidak Puas</p>}
                  />
                  <FormControlLabel
                    value="Kurang Puas"
                    control={<Radio />}
                    label={<p>Kurang Puas</p>}
                  />
                  <FormControlLabel
                    value="Puas"
                    control={<Radio />}
                    label={<p>Puas</p>}
                  />
                  <FormControlLabel
                    value="Sangat Puas"
                    control={<Radio />}
                    label={<p>Sangat Puas</p>}
                  />
                </RadioGroup>
                <FormHelperText>
                  {formik.touched.sepuluh && formik.errors.sepuluh}
                </FormHelperText>
              </FormControl>
            </div>
            {/* saran  */}
            <div className="col-xs-12">
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                margin="normal"
                label="Saran"
                name="saran"
                value={formik.values.saran}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.saran && Boolean(formik.errors.saran)}
                helperText={formik.touched.saran && formik.errors.saran}
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
                ref={recaptchaRef}
                onChange={captchaChange}
              />
            </div>
            <div className="col-xs-12 col-sm-6">
              <Button
                type="submit"
                variant="contained"
                className="btn btn-info"
              >
                Kirim
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div id="block-answer" ref={answerRef} style={{ marginTop: "30px" }}>
        <div
          style={{
            display: response ? "block" : "none",
          }}
        >
          <h3>TERIMAKASIH SUDAH MELAKUKAN SURVEY PPID BAWASLU</h3>
          <div className="text-left">
            Penilaian yang anda berikan akan menjadi motivasi kami agar lebih
            baik lagi.
          </div>
        </div>
      </div>
    </div>
  );
}

Survey.public = true;
export default Survey;
