import { useRef, useState, useEffect } from "react";
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
// COMPONENTS
import Thumb from "components/Thumb";
import ResponsePermohonan from "components/PublicComponents/ResponsePermohonan";
import BuktiPermohonanOnline from "components/PrintPage/BuktiPermohonanOnline";

const config = {
  headers: { "content-type": "multipart/form-data", destinationfile: "upload" },
  onUploadProgress: (event) => {
    // console.log(
    //   `Current progress:`,
    //   Math.round((event.loaded * 100) / event.total)
    // );
  },
};

const handleSubmit = (values, recaptchaRef, afterSubmit, setCurData) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi");
    return;
  }
  setCurData(() => {});

  const form = new FormData();
  for (var key in values) {
    if (key === "file") {
      form.append(key, values[key], values[key].name);
    } else {
      form.append(key, values[key]);
    }
  }

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
  nama: yup.string("Masukan Nama").required("Harus Diisi"),
  pekerjaan: yup.string("Masukan Pekerjaan").required("Harus Diisi"),
  telp: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email: yup.string().email("Email Tidak Valid").required("Harus Diisi"),
  alamat: yup.string().required("Alamat Harus Diisi"),
  rincian: yup.string().required("Harus Diisi"),
  tujuan: yup.string().required("Harus Diisi"),
  cara_terima: yup.string().required("Harus Diisi"),
  cara_dapat: yup.string().required("Harus Diisi"),
  file: yup.mixed().required("Harus Upload"),
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
});

const Permohonan = () => {
  const [curData, setCurData] = useState({});
  const [provinsis, setProvinsis] = useState([]);
  const [kabkots, setKabkots] = useState([]);
  const [profileBawaslu, setProfileBawaslu] = useState({});

  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const printBuktiRef = useRef();

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

  const fetchProfileBawaslu = (callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/permohonan/profileBawaslu?id=` + curData.id_will)
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

  const formik = useFormik({
    initialValues: {
      kepada: "",
      id_prov: "",
      id_kabkot: "",
      nama: "",
      pekerjaan: "",
      telp: "",
      email: "",
      alamat: "",
      rincian: "",
      tujuan: "",
      cara_terima: "",
      cara_dapat: "",
      file: null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) =>
      handleSubmit(values, recaptchaRef, afterSubmit, setCurData),
  });

  const captchaChange = () => {
    toast.dismiss();
  };

  const afterSubmit = (data) => {
    setCurData(() => data);
    formik.resetForm();
    answerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    // console.log(curData);
  }, [curData]);

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
                      formik.touched.id_kabkot &&
                      Boolean(formik.errors.id_kabkot)
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
                  helperText={
                    formik.touched.pekerjaan && formik.errors.pekerjaan
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
                  name="telp"
                  value={formik.values.telp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.telp && Boolean(formik.errors.telp)}
                  helperText={formik.touched.telp && formik.errors.telp}
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
              {/* ktp */}
              <div className="col-xs-12" style={{ marginTop: 2 }}>
                <div className="form-group">
                  <label>Upload Tanda Pengenal</label>
                  <input
                    className="form form-control"
                    required
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
                  <Thumb file={formik.values.file} />
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
        <BuktiPermohonanOnline
          ref={printBuktiRef}
          detail={curData}
          profileBawaslu={profileBawaslu}
        />
      )}
    </div>
  );
};

Permohonan.public = true;
export default Permohonan;
