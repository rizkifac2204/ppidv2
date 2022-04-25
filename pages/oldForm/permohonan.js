import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactToPrint } from "react-to-print";
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
// COMPONENTS
import Thumb from "components/Thumb";
import ResponsePermohonan from "components/PublicComponents/ResponsePermohonan";
import BuktiPermohonan from "components/PrintPage/BuktiPermohonan";

const config = {
  headers: { "content-type": "multipart/form-data", destinationfile: "upload" },
  onUploadProgress: (event) => {
    // console.log(
    //   `Current progress:`,
    //   Math.round((event.loaded * 100) / event.total)
    // );
  },
};

const handleSubmit = (
  values,
  recaptchaRef,
  afterSubmit,
  setSubmitting,
  formik
) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi");
    setSubmitting(false);
    return;
  }
  const form = new FormData();
  for (var key in values) {
    // if (key === "file") {
    //   form.append(key, values[key], values[key].name);
    // } else {
    form.append(key, values[key]);
    // }
  }
  // Display the key/value pairs
  // for (var pair of form.entries()) {
  //   console.log(pair[0] + ", " + pair[1]);
  // }
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/public/permohonan`, form, config)
    .then((res) => {
      afterSubmit(res.data.currentData);
      toast.update(toastProses, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
      if (err.response.data.currentData) {
        formik.setFieldValue(
          "identitas_pemohon",
          err.response.data.currentData.identitas_pemohon
        );
      }
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
      if (recaptchaRef.current) recaptchaRef.current.reset();
    });
};

const validationSchema = yup.object({
  email_pemohon: yup
    .string()
    .email("Email Tidak Valid")
    .required("Harus Diisi"),
  nama_pemohon: yup.string("Masukan Nama").required("Harus Diisi"),
  pekerjaan_pemohon: yup.string("Masukan Pekerjaan").required("Harus Diisi"),
  pendidikan_pemohon: yup.string("Masukan Pendidikan").required("Harus Diisi"),
  telp_pemohon: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  alamat_pemohon: yup.string().required("Alamat Harus Diisi"),
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
  rincian: yup.string().required("Harus Diisi"),
  tujuan: yup.string().required("Harus Diisi"),
  cara_terima: yup.string().required("Harus Diisi"),
  cara_dapat: yup.string().required("Harus Diisi"),
  identitas_pemohon: yup.string(),
  file: yup
    .mixed()
    .test(
      "FILE_SIZE",
      "Ukuran Gambar Melebihi 4mb.",
      (value) => !value || (value && value.size <= 4194304) // 4 mb
    )
    .test(
      "FILE_FORMAT",
      "Format Gambar Tidak Sesuai.",
      (value) =>
        !value ||
        (value &&
          [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/bmp",
          ].includes(value.type))
    )
    .when("identitas_pemohon", {
      is: (identitas_pemohon) => !identitas_pemohon,
      then: yup.mixed().required("Harus Upload"),
      otherwise: yup.mixed(),
    }),
});

const Permohonan = () => {
  // prepare
  const router = useRouter();
  const { q } = router.query;
  const [curData, setCurData] = useState({});
  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);
  const [loadPemohon, setLoadPemohon] = useState({
    open: false,
    message: "",
    attr: {},
    used: false,
  });
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const [initialValues, setInitialValues] = useState({
    email_pemohon: "",
    nama_pemohon: "",
    pekerjaan_pemohon: "",
    pendidikan_pemohon: "",
    telp_pemohon: "",
    alamat_pemohon: "",
    kepada: "",
    id_prov: "",
    id_kabkota: "",
    rincian: "",
    tujuan: "",
    cara_terima: "",
    cara_dapat: "",
    identitas_pemohon: "",
    file: null,
  });

  // useRef
  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const printBuktiRef = useRef();

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
  const fetchkabkota = (id, cb) => {
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
  const fetchProfileBawaslu = (callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/services/profileBawaslu?id=` + curData.bawaslu_id)
      .then((res) => {
        setProfileBawaslu(res.data);
        toast.dismiss(toastProses);
        callback();
      })
      .catch((err) => {
        console.log(err);
        toast.update(toastProses, {
          render: "Terjadi Kesalahan",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };

  // PRINT
  const handlePrint = () => {
    return fetchProfileBawaslu(() => {
      processPrintBukti();
    });
  };
  const processPrintBukti = useReactToPrint({
    content: () => printBuktiRef.current,
  });

  // formik dan submit
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setCurData({});
      handleSubmit(values, recaptchaRef, afterSubmit, setSubmitting, formik);
    },
  });
  const afterSubmit = (data) => {
    setCurData(() => data);
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
    if (formik.values.kepada === "Bawaslu") fetchkabkota(formik.values.id_prov);
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
      fetchkabkota(q.substring(0, 2), () => {
        const arrayID = kabkotas.map((a) => a.id);
        if (arrayID.includes(q)) formik.setFieldValue("id_kabkota", q);
      });
    }
  }, [q, provinsis]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="block-form">
      <div
        style={{
          display:
            curData && Object.keys(curData).length === 0 ? "block" : "none",
        }}
      >
        <h2>Formulir Pengajuan Permohonan Informasi</h2>

        <p>
          Isi Formulir untuk melakukan Permohonan Informasi <br />
          <strong>Pelayanan Kantor</strong> pukul 08:00 AM s.d 16:00 PM. Kamu
          juga dapat melakukan permohonan dengan menghubungi 08777.
        </p>

        <div style={{ marginTop: "20px" }}>
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              {/* email  */}
              <div className="col-xs-12">
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
                    formik.touched.pekerjaan &&
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
              {/* pekerjaan  */}
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
              {/* telp  */}
              <div className="col-xs-12 col-sm-6">
                <TextField
                  fullWidth
                  required
                  margin="normal"
                  label="Telp/Hp"
                  name="telp_pemohon"
                  value={formik.values.telp_pemohon}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.telp_pemohon &&
                    Boolean(formik.errors.telp_pemohon)
                  }
                  helperText={
                    formik.touched.telp_pemohon && formik.errors.telp_pemohon
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
                    formik.touched.alamat_pemohon &&
                    formik.errors.alamat_pemohon
                  }
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
            </div>

            <div className="row">
              {/* kepada */}
              <div className="col-xs-12">
                <FormControl
                  fullWidth
                  sx={{ mt: 1.5 }}
                  error={formik.touched.kepada && Boolean(formik.errors.kepada)}
                >
                  <InputLabel>
                    <p>Ditujukan Kepada *</p>
                  </InputLabel>
                  <Select
                    name="kepada"
                    label={<p>Ditujukan Kepada</p>}
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
                  <div className="col-xs-12">
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
              {/* kabkot */}
              {formik.values.kepada && formik.values.kepada === "Bawaslu" && (
                <div className="col-xs-12">
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
              {/* rincian  */}
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                  label="Rincian Informasi"
                  name="rincian"
                  value={formik.values.rincian}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.rincian && Boolean(formik.errors.rincian)
                  }
                  helperText={formik.touched.rincian && formik.errors.rincian}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              {/* tujuan  */}
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                  label="Tujuan Informasi"
                  name="tujuan"
                  value={formik.values.tujuan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.tujuan && Boolean(formik.errors.tujuan)}
                  helperText={formik.touched.tujuan && formik.errors.tujuan}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              {/* cara terima  */}
              <div className="col-xs-12">
                <FormControl
                  sx={{ my: 2 }}
                  component="fieldset"
                  error={
                    formik.touched.cara_terima &&
                    Boolean(formik.errors.cara_terima)
                  }
                  variant="standard"
                >
                  <FormLabel>
                    <p>Cara Memperoleh Informasi *</p>
                  </FormLabel>
                  <RadioGroup
                    aria-label="cara_terima"
                    name="cara_terima"
                    value={formik.values.cara_terima}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="Melihat/Membaca/Mendengarkan/Mencatat"
                      control={<Radio />}
                      label={<p>Melihat/Membaca/Mendengarkan/Mencatat</p>}
                    />
                    <FormControlLabel
                      value="Mendapatkan salinan Informasi (hardcopy/softcopy)"
                      control={<Radio />}
                      label={
                        <p>Mendapatkan salinan Informasi (hardcopy/softcopy)</p>
                      }
                    />
                  </RadioGroup>
                  <FormHelperText>
                    {formik.touched.cara_terima && formik.errors.cara_terima}
                  </FormHelperText>
                </FormControl>
              </div>
              {/* cara dapat  */}
              <div className="col-xs-12">
                <FormControl
                  component="fieldset"
                  error={
                    formik.touched.cara_dapat &&
                    Boolean(formik.errors.cara_dapat)
                  }
                  variant="standard"
                >
                  <FormLabel>
                    <p>Cara Mendapatkan Salinan Informasi *</p>
                  </FormLabel>
                  <RadioGroup
                    aria-label="cara_dapat"
                    name="cara_dapat"
                    value={formik.values.cara_dapat}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="Mengambil Langsung"
                      control={<Radio />}
                      label={<p>Mengambil Langsung</p>}
                    />
                    <FormControlLabel
                      value="Pos"
                      control={<Radio />}
                      label={<p>Pos</p>}
                    />
                    <FormControlLabel
                      value="Email"
                      control={<Radio />}
                      label={<p>Email</p>}
                    />
                    <FormControlLabel
                      value="Kurir"
                      control={<Radio />}
                      label={<p>Kurir</p>}
                    />
                    <FormControlLabel
                      value="Faksimili"
                      control={<Radio />}
                      label={<p>Faksimili</p>}
                    />
                  </RadioGroup>
                  <FormHelperText>
                    {formik.touched.cara_dapat && formik.errors.cara_dapat}
                  </FormHelperText>
                </FormControl>
              </div>
              {/* tanda pengenal */}
              <div className="col-xs-12" style={{ marginTop: 2 }}>
                <div className="form-group">
                  <label>
                    {loadPemohon.used
                      ? "Biarkan atau Upload ulang jika ingin mengganti Tanda Pengenal"
                      : "Upload Tanda Pengenal"}
                  </label>
                  <input
                    className="form form-control"
                    type="file"
                    id="file"
                    name="file"
                    accept="image/*"
                    onBlur={formik.handleBlur}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "file",
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  <Thumb
                    file={
                      formik.values.file
                        ? formik.values.file
                        : formik.values.identitas_pemohon
                    }
                  />
                  <br />
                  {formik.touched.file && formik.errors.file}
                </div>
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
      </div>

      <div id="block-answer" ref={answerRef}>
        {curData && Object.keys(curData).length !== 0 && (
          <ResponsePermohonan curData={curData} handlePrint={handlePrint} />
        )}
        <div
          style={{
            display:
              curData && Object.keys(curData).length !== 0 ? "block" : "none",
          }}
        >
          <Button
            id="isilagi"
            type="button"
            variant="contained"
            className="btn btn-info"
            onClick={() => {
              setTimeout(() => {
                setCurData({});
              }, 500);
            }}
          >
            Ajukan Permohonan Kembali
          </Button>
        </div>
      </div>

      {curData && Object.keys(curData).length !== 0 && (
        <BuktiPermohonan
          ref={printBuktiRef}
          detail={curData}
          profileBawaslu={profileBawaslu}
        />
      )}

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
};

Permohonan.public = true;
export default Permohonan;
