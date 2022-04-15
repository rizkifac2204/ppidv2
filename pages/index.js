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

const handleSubmit = (values, recaptchaRef, afterSubmit) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi");
    return;
  }

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
      console.log(err.response.data);
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
  nama_pemohon: yup.string("Masukan Nama").required("Harus Diisi"),
  pekerjaan_pemohon: yup.string("Masukan Pekerjaan").required("Harus Diisi"),
  pendidikan_pemohon: yup.string("Masukan Pendidikan").required("Harus Diisi"),
  telp_pemohon: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  email_pemohon: yup
    .string()
    .email("Email Tidak Valid")
    .required("Harus Diisi"),
  alamat_pemohon: yup.string().required("Alamat Harus Diisi"),
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
  id_kabkota: yup.number().when("kepada", {
    is: (kepada) => kepada === "Bawaslu",
    then: yup.number().required("Kabupaten/Kota Harus Diisi"),
    otherwise: yup.number(),
  }),
});

const Permohonan = () => {
  const [curData, setCurData] = useState({});
  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);
  const [profileBawaslu, setProfileBawaslu] = useState({});

  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const printBuktiRef = useRef();

  const fetchProv = () => {
    axios
      .get(`/api/services/provinsis`)
      .then((res) => {
        setProvinsis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchKabkot = (id) => {
    axios
      .get(`/api/services/provinsis/` + id)
      .then((res) => {
        setKabkotas(res.data.kabkot);
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

  const formik = useFormik({
    initialValues: {
      kepada: "",
      id_prov: "",
      id_kabkota: "",
      nama_pemohon: "",
      pekerjaan_pemohon: "",
      pendidikan_pemohon: "",
      telp_pemohon: "",
      email_pemohon: "",
      alamat_pemohon: "",
      rincian: "",
      tujuan: "",
      cara_terima: "",
      cara_dapat: "",
      file: null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => handleSubmit(values, recaptchaRef, afterSubmit),
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
    if (!formik.values.kepada) return;
    formik.setFieldValue("id_prov", "");
    formik.setFieldValue("id_kabkota", "");
    if (
      formik.values.kepada !== "Bawaslu Republik Indonesia" &&
      provinsis.length === 0
    )
      fetchProv();
  }, [formik.values.kepada]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    formik.setFieldValue("id_kabkota", "");
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
            </div>
            <div className="row">
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
                  onBlur={formik.handleBlur}
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
    </div>
  );
};

Permohonan.public = true;
export default Permohonan;
