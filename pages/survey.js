import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const handleSubmit = (
  values,
  recaptchaRef,
  afterSubmit,
  setResponse,
  setSubmitting
) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi");
    setSubmitting(false);
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
      setSubmitting(false);
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
  id_kabkota: yup.number().when("kepada", {
    is: (kepada) => kepada === "Bawaslu",
    then: yup.number().required("Kabupaten/Kota Harus Diisi"),
    otherwise: yup.number(),
  }),
  nama_pemohon: yup.string().required("Harus Diisi"),
  jenis_kelamin_pemohon: yup.string().required("Harus Diisi"),
  pendidikan_pemohon: yup.string().required("Telp Harus Diisi"),
  email_pemohon: yup
    .string()
    .email("Email Tidak Valid")
    .required("Harus Diisi"),
  pekerjaan_pemohon: yup.string().required("Harus Diisi"),
  alamat_pemohon: yup.string().required("Harus Diisi"),
  q1: yup.string().required("Harus Diisi"),
  q2: yup.string().required("Harus Diisi"),
  q3: yup.string().required("Harus Diisi"),
  q4: yup.string().required("Harus Diisi"),
  q5: yup.string().required("Harus Diisi"),
  q6: yup.string().required("Harus Diisi"),
  q7: yup.string().required("Harus Diisi"),
  q8: yup.string().required("Harus Diisi"),
  q9: yup.string().required("Harus Diisi"),
  q10: yup.string().required("Harus Diisi"),
  saran: yup.string().required("Harus Diisi"),
});

function Survey() {
  // prepare
  const router = useRouter();
  const { q } = router.query;
  const [response, setResponse] = useState(false);
  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);
  const [loadPemohon, setLoadPemohon] = useState({
    open: false,
    message: "",
    attr: {},
    used: false,
  });
  const [initialValues, setInitialValues] = useState({
    kepada: "",
    id_prov: "",
    id_kabkota: "",
    nama_pemohon: "",
    jenis_kelamin_pemohon: "",
    pendidikan_pemohon: "",
    email_pemohon: "",
    pekerjaan_pemohon: "",
    alamat_pemohon: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    q10: "",
    saran: "",
  });
  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);

  // fetching wilayah
  const fetchProv = (cb) => {
    if (provinsis.length !== 0) {
      if (cb) cb();
      return;
    }
    axios
      .get(`/api/services/provinsis`)
      .then((res) => {
        setProvinsis(() => res.data);
        if (cb) cb();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchKabkota = (id, cb) => {
    axios
      .get(`/api/services/provinsis/` + id)
      .then((res) => {
        setKabkotas(() => res.data.kabkota);
        if (cb) cb();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // formik dan submit
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(
        values,
        recaptchaRef,
        afterSubmit,
        setResponse,
        setSubmitting
      );
    },
  });
  const afterSubmit = (res) => {
    setResponse(true);
    formik.resetForm();
    answerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Utils

  const captchaChange = () => {
    toast.dismiss();
  };

  // load Pemohon
  const handleUsePemohon = (event) => {
    event.preventDefault();
    const initAgain = { ...formik.values, ...loadPemohon.attr };
    setInitialValues(() => initAgain);
    setLoadPemohon({ ...loadPemohon, open: false, used: true });
  };
  const hanldeConfirmPemohon = (data) => {
    const tempPemohon = {
      ...loadPemohon,
      open: true,
      attr: data,
      message: "Gunakan Data " + data.nama_pemohon + "?",
    };
    setLoadPemohon(tempPemohon);
  };
  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleUsePemohon}>
        Gunakan
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setLoadPemohon({ ...loadPemohon, open: false })}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  const getPemohonByEmail = (e) => {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailPattern.test(e.target.value)) {
      axios
        .post(`/api/public/getPemohon`, {
          email_pemohon: e.target.value,
        })
        .then((res) => {
          hanldeConfirmPemohon(res.data);
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };

  // EFFECT
  useEffect(() => {
    if (!formik.values.kepada) return;
    formik.setFieldValue("id_prov", "");
    formik.setFieldValue("id_kabkota", "");
    if (formik.values.kepada !== "Bawaslu Republik Indonesia") fetchProv();
  }, [formik.values.kepada]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    formik.setFieldValue("id_kabkota", "");
    if (!formik.values.id_prov) return;
    if (formik.values.kepada === "Bawaslu") fetchKabkota(formik.values.id_prov);
  }, [formik.values.id_prov]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!q) return;
    if (q == 0) formik.setFieldValue("kepada", "Bawaslu Republik Indonesia");
    if (q.length === 2) {
      formik.setFieldValue("kepada", "Bawaslu Provinsi");
      fetchProv(() => {
        const arrayID = provinsis.map((a) => a.id);
        if (arrayID.includes(q)) formik.setFieldValue("id_prov", q);
      });
    }
    if (q.length === 4) {
      formik.setFieldValue("kepada", "Bawaslu");
      fetchProv(() => {
        const arrayID = provinsis.map((a) => a.id);
        if (arrayID.includes(q.substring(0, 2)))
          formik.setFieldValue("id_prov", q.substring(0, 2));
      });
      fetchKabkota(q.substring(0, 2), () => {
        const arrayID = kabkotas.map((a) => a.id);
        if (arrayID.includes(q)) formik.setFieldValue("id_kabkota", q);
      });
    }
  }, [q, provinsis]); // eslint-disable-line react-hooks/exhaustive-deps

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
          {/* DATA DIRI */}
          <div className="row">
            {/* email  */}
            <div className="col-xs-12 col-sm-6">
              <TextField
                fullWidth
                required
                margin="normal"
                type="email"
                label="Email"
                name="email_pemohon"
                value={formik.values.email_pemohon}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  getPemohonByEmail(e);
                }}
                error={
                  formik.touched.email_pemohon &&
                  Boolean(formik.errors.email_pemohon)
                }
                helperText={
                  formik.touched.email_pemohon && formik.errors.email_pemohon
                }
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* nama */}
            <div className="col-xs-12 col-sm-6">
              <TextField
                fullWidth
                required
                margin="normal"
                label="Nama"
                name="nama_pemohon"
                value={formik.values.nama_pemohon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.nama_pemohon &&
                  Boolean(formik.errors.nama_pemohon)
                }
                helperText={
                  formik.touched.nama_pemohon && formik.errors.nama_pemohon
                }
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
            {/* jenis_kelamin  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={
                  formik.touched.jenis_kelamin_pemohon &&
                  Boolean(formik.errors.jenis_kelamin_pemohon)
                }
                variant="standard"
              >
                <RadioGroup
                  aria-label="jenis_kelamin"
                  name="jenis_kelamin_pemohon"
                  value={formik.values.jenis_kelamin_pemohon}
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
                  {formik.touched.jenis_kelamin_pemohon &&
                    formik.errors.jenis_kelamin_pemohon}
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
                name="pendidikan_pemohon"
                value={formik.values.pendidikan_pemohon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.pendidikan_pemohon &&
                  Boolean(formik.errors.pendidikan_pemohon)
                }
                helperText={
                  formik.touched.pendidikan_pemohon &&
                  formik.errors.pendidikan_pemohon
                }
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
                name="pekerjaan_pemohon"
                value={formik.values.pekerjaan_pemohon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.pekerjaan_pemohon &&
                  Boolean(formik.errors.pekerjaan_pemohon)
                }
                helperText={
                  formik.touched.pekerjaan_pemohon &&
                  formik.errors.pekerjaan_pemohon
                }
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
                name="alamat_pemohon"
                value={formik.values.alamat_pemohon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.alamat_pemohon &&
                  Boolean(formik.errors.alamat_pemohon)
                }
                helperText={
                  formik.touched.alamat_pemohon && formik.errors.alamat_pemohon
                }
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
              />
            </div>
          </div>
          {/* DATA BAWASLU  */}
          <div className="row">
            {/* kepada */}
            <div className="col-xs-12">
              <FormControl
                fullWidth
                sx={{ mt: 2 }}
                error={formik.touched.kepada && Boolean(formik.errors.kepada)}
              >
                <InputLabel>
                  <p>Penerima *</p>
                </InputLabel>
                <Select
                  name="kepada"
                  label={<p>Penerima</p>}
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
            {formik.values.kepada &&
              formik.values.kepada !== "Bawaslu Republik Indonesia" && (
                <div className="col-xs-12 col-sm-6">
                  <FormControl
                    fullWidth
                    sx={{ mt: 2 }}
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
            {/* kabkota */}
            {formik.values.kepada && formik.values.kepada === "Bawaslu" && (
              <div className="col-xs-12 col-sm-6">
                <FormControl
                  fullWidth
                  sx={{ mt: 2 }}
                  error={
                    formik.touched.id_kabkota &&
                    Boolean(formik.errors.id_kabkota)
                  }
                >
                  <InputLabel>
                    <p>Kabupaten/Kota *</p>
                  </InputLabel>
                  <Select
                    name="id_kabkota"
                    label={<p>Kabupaten/Kota</p>}
                    value={formik.values.id_kabkota}
                    onChange={formik.handleChange}
                  >
                    {kabkotas.length !== 0 &&
                      kabkotas.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.kabkota}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.id_kabkota && formik.errors.id_kabkota}
                  </FormHelperText>
                </FormControl>
              </div>
            )}
          </div>
          {/* DATA PERTANYAAN  */}
          <div className="row">
            {/* q1  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                sx={{ mt: 2 }}
                error={formik.touched.q1 && Boolean(formik.errors.q1)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kesesuaian persyaratan
                    permohonan informasi publik dengan jenis pelayanannya?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q1"
                  name="q1"
                  value={formik.values.q1}
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
                  {formik.touched.q1 && formik.errors.q1}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q2  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q2 && Boolean(formik.errors.q2)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kemudahan prosedur
                    pelayanan permohonan informasi publik di Bawaslu?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q2"
                  name="q2"
                  value={formik.values.q2}
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
                  {formik.touched.q2 && formik.errors.q2}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q3  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q3 && Boolean(formik.errors.q3)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kecepatan waktu petugas
                    dalam memberikan pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q3"
                  name="q3"
                  value={formik.values.q3}
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
                  {formik.touched.q3 && formik.errors.q3}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q4  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q4 && Boolean(formik.errors.q4)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kewajaran biaya/tarif
                    dalam pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q4"
                  name="q4"
                  value={formik.values.q4}
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
                  {formik.touched.q4 && formik.errors.q4}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q5  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q5 && Boolean(formik.errors.q5)}
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
                  aria-label="q5"
                  name="q5"
                  value={formik.values.q5}
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
                  {formik.touched.q5 && formik.errors.q5}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q6  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q6 && Boolean(formik.errors.q6)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kompetensi/kemampuan
                    petugas dalam pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q6"
                  name="q6"
                  value={formik.values.q6}
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
                  {formik.touched.q6 && formik.errors.q6}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q7  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q7 && Boolean(formik.errors.q7)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang perilaku petugas dalam
                    pelayanan informasi publik terkait kesopanan dan keramahan?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q7"
                  name="q7"
                  value={formik.values.q7}
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
                  {formik.touched.q7 && formik.errors.q7}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q8  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q8 && Boolean(formik.errors.q8)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang kualitas sarana dan
                    prasarana pelayanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q8"
                  name="q8"
                  value={formik.values.q8}
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
                  {formik.touched.q8 && formik.errors.q8}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q9  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q9 && Boolean(formik.errors.q9)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang penanganan pengaduan
                    pengguna layanan informasi publik?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q9"
                  name="q9"
                  value={formik.values.q9}
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
                  {formik.touched.q9 && formik.errors.q9}
                </FormHelperText>
              </FormControl>
            </div>
            {/* q10  */}
            <div className="col-xs-12">
              <FormControl
                component="fieldset"
                error={formik.touched.q10 && Boolean(formik.errors.q10)}
                variant="standard"
              >
                <FormLabel>
                  <p>
                    Bagaimana pendapat Saudara tentang tingkat kepuasan terhadap
                    keseluruhan pelayanan informasi publik di Bawaslu?
                  </p>
                </FormLabel>
                <RadioGroup
                  aria-label="q10"
                  name="q10"
                  value={formik.values.q10}
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
                  {formik.touched.q10 && formik.errors.q10}
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
          {/* Captcha submit  */}
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
                disabled={formik.isSubmitting}
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

      <Snackbar
        open={loadPemohon.open}
        onClose={() =>
          setLoadPemohon((prev) => (prev = { ...loadPemohon, open: false }))
        }
        message={loadPemohon.message}
        action={action}
      />
    </div>
  );
}

Survey.public = true;
export default Survey;
