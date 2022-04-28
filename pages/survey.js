import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
// MUI
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// COMPONENT
import ResponseSurvey from "components/PublicComponents/ResponseSurvey";
import {
  TextFieldCustom,
  FormControlCustom,
  InputLabelCustom,
  FormLabelCustom,
  SelectCustom,
  MenuItemCustom,
  FormControlLabelRadioCustom,
  TextRadioCustom,
} from "components/PublicComponents/FieldCustom";

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
  // useRef
  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const formRef = useRef(null);

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
      <Button
        color="secondary"
        onClick={handleUsePemohon}
        style={{ fontSize: 14 }}
      >
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
          console.log(res);
          hanldeConfirmPemohon(res.data);
        })
        .catch((err) => {
          toast.error(
            "Email Tidak Ditemukan Sebagai Pemohon, Data Mungkin Tidak Akan Tersimpan",
            {
              position: "top-right",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
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
    <>
      <div id="formulir-popup" style={{ overflowY: "auto", height: "100%" }}>
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-file-text fa-2x" />
              <br />
              <span className="point">Formulir</span> Survey Layanan
            </h2>
            <p>
              Isi Formulir untuk melakukan Survey Layanan PPID Bawaslu.
              Pelayanan Kantor pukul 08:00 AM s.d 16:00 PM.
            </p>
          </div>
          {/* .item-title */}
          <button
            className="scroll-chevron"
            onClick={() => {
              formRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <i className="fa fa-chevron-down fa-2x" />
          </button>
        </div>
        <div className="info-item">
          <div className="newsletter-block">
            {/* Formulir Start  */}
            <div className="col-xs-12 block-right-newsletter" ref={formRef}>
              <div id="subscribe">
                <h2>Formulir Survey Layanan</h2>
                <p>Isi Pertanyaan-pertanyaan dibawah ini</p>

                <form
                  onSubmit={formik.handleSubmit}
                  id="contact-form"
                  style={{ marginTop: "20px" }}
                >
                  {/* DATA DIRI  */}
                  <div className="row">
                    {/* email  */}
                    <div className="col-xs-12 col-sm-6">
                      <TextFieldCustom
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
                          formik.touched.email_pemohon &&
                          formik.errors.email_pemohon
                        }
                      />
                    </div>

                    {/* nama */}
                    <div className="col-xs-12 col-sm-6">
                      <TextFieldCustom
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
                          formik.touched.nama_pemohon &&
                          formik.errors.nama_pemohon
                        }
                      />
                    </div>

                    {/* Jenis Kelamin  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={
                          formik.touched.jenis_kelamin_pemohon &&
                          Boolean(formik.errors.jenis_kelamin_pemohon)
                        }
                      >
                        <FormLabelCustom>Jenis Kelamin *</FormLabelCustom>
                        <RadioGroup
                          aria-label="jenis_kelamin_pemohon"
                          name="jenis_kelamin_pemohon"
                          value={formik.values.jenis_kelamin_pemohon}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Laki-laki"
                            label={<TextRadioCustom text="Laki-laki" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Perempuan"
                            label={<TextRadioCustom text="Perempuan" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.jenis_kelamin_pemohon &&
                            formik.errors.jenis_kelamin_pemohon}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* pekerjaan  */}
                    <div className="col-xs-12 col-sm-6">
                      <TextFieldCustom
                        fullWidth
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
                      />
                    </div>

                    {/* pendidikan  */}
                    <div className="col-xs-12 col-sm-6">
                      <TextFieldCustom
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
                      />
                    </div>

                    {/* alamat  */}
                    <div className="col-xs-12">
                      <TextFieldCustom
                        multiline
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
                      />
                    </div>
                  </div>

                  {/* DATA BAWASLU  */}
                  <div className="row">
                    {/* kepada */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        error={
                          formik.touched.kepada && Boolean(formik.errors.kepada)
                        }
                      >
                        <InputLabelCustom>Ditujukan Kepada *</InputLabelCustom>
                        <SelectCustom
                          name="kepada"
                          value={formik.values.kepada}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          <MenuItemCustom value="Bawaslu Republik Indonesia">
                            Bawaslu Republik Indonesia
                          </MenuItemCustom>
                          <MenuItemCustom value="Bawaslu Provinsi">
                            Bawaslu Provinsi
                          </MenuItemCustom>
                          <MenuItemCustom value="Bawaslu">
                            Bawaslu Kabupaten/Kota
                          </MenuItemCustom>
                        </SelectCustom>
                        <FormHelperText>
                          {formik.touched.kepada && formik.errors.kepada}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* provinsi  */}
                    {formik.values.kepada &&
                      formik.values.kepada !== "Bawaslu Republik Indonesia" && (
                        <div className="col-xs-12">
                          <FormControlCustom
                            error={
                              formik.touched.id_prov &&
                              Boolean(formik.errors.id_prov)
                            }
                          >
                            <InputLabelCustom>Provinsi *</InputLabelCustom>
                            <SelectCustom
                              name="id_prov"
                              value={formik.values.id_prov}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <MenuItemCustom value="">
                                --Pilih--
                              </MenuItemCustom>
                              {provinsis.length !== 0 &&
                                provinsis.map((item, idx) => (
                                  <MenuItemCustom key={idx} value={item.id}>
                                    {formik.values.kepada ===
                                      "Bawaslu Provinsi" && "Bawaslu"}{" "}
                                    {item.provinsi}
                                  </MenuItemCustom>
                                ))}
                            </SelectCustom>
                            <FormHelperText>
                              {formik.touched.id_prov && formik.errors.id_prov}
                            </FormHelperText>
                          </FormControlCustom>
                        </div>
                      )}

                    {/* kabkot */}
                    {formik.values.kepada &&
                      formik.values.kepada === "Bawaslu" && (
                        <div className="col-xs-12">
                          <FormControlCustom
                            error={
                              formik.touched.id_kabkota &&
                              Boolean(formik.errors.id_kabkota)
                            }
                          >
                            <InputLabelCustom>
                              Kabupaten/Kota *
                            </InputLabelCustom>
                            <SelectCustom
                              name="id_kabkota"
                              value={formik.values.id_kabkota}
                              onChange={formik.handleChange}
                            >
                              {kabkotas.length !== 0 &&
                                kabkotas.map((item) => (
                                  <MenuItemCustom key={item.id} value={item.id}>
                                    Bawaslu {item.kabkota}
                                  </MenuItemCustom>
                                ))}
                            </SelectCustom>
                            <FormHelperText>
                              {formik.touched.id_kabkota &&
                                formik.errors.id_kabkota}
                            </FormHelperText>
                          </FormControlCustom>
                        </div>
                      )}
                  </div>

                  {/* PERTANYAAN  */}
                  <div className="row">
                    {/* q1  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q1 && Boolean(formik.errors.q1)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang kesesuaian
                          persyaratan permohonan informasi publik dengan jenis
                          pelayanannya?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q1"
                          name="q1"
                          value={formik.values.q1}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Sesuai"
                            label={<TextRadioCustom text="Tidak Sesuai" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Sesuai"
                            label={<TextRadioCustom text="Kurang Sesuai" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sesuai"
                            label={<TextRadioCustom text="Sesuai" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Sesuai"
                            label={<TextRadioCustom text="Sangat Sesuai" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q1 && formik.errors.q1}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q2  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q2 && Boolean(formik.errors.q2)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang kemudahan prosedur
                          pelayanan permohonan informasi publik di Bawaslu?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q2"
                          name="q2"
                          value={formik.values.q2}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Mudah"
                            label={<TextRadioCustom text="Tidak Mudah" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Mudah"
                            label={<TextRadioCustom text="Kurang Mudah" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Mudah"
                            label={<TextRadioCustom text="Mudah" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Mudah"
                            label={<TextRadioCustom text="Sangat Mudah" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q2 && formik.errors.q2}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q3  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q3 && Boolean(formik.errors.q3)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang kecepatan waktu
                          petugas dalam memberikan pelayanan informasi publik?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q3"
                          name="q3"
                          value={formik.values.q3}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Cepat"
                            label={<TextRadioCustom text="Tidak Cepat" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Cepat"
                            label={<TextRadioCustom text="Kurang Cepat" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Cepat"
                            label={<TextRadioCustom text="Cepat" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Cepat"
                            label={<TextRadioCustom text="Sangat Cepat" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q3 && formik.errors.q3}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q4  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q4 && Boolean(formik.errors.q4)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang kewajaran
                          biaya/tarif dalam pelayanan informasi publik?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q4"
                          name="q4"
                          value={formik.values.q4}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Mahal"
                            label={<TextRadioCustom text="Tidak Mahal" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Cukup Mahal"
                            label={<TextRadioCustom text="Cukup Mahal" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Mahal"
                            label={<TextRadioCustom text="Mahal" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Mahal"
                            label={<TextRadioCustom text="Sangat Mahal" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q4 && formik.errors.q4}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q5  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q5 && Boolean(formik.errors.q5)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang kesesuaian produk
                          pelayanan antara yang tercantum dalam standar
                          pelayanan dengan hasil yang diberikan?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q5"
                          name="q5"
                          value={formik.values.q5}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Sesuai"
                            label={<TextRadioCustom text="Tidak Sesuai" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Sesuai"
                            label={<TextRadioCustom text="Kurang Sesuai" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sesuai"
                            label={<TextRadioCustom text="Sesuai" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Sesuai"
                            label={<TextRadioCustom text="Sangat Sesuai" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q5 && formik.errors.q5}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q6  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q6 && Boolean(formik.errors.q6)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang
                          kompetensi/kemampuan petugas dalam pelayanan informasi
                          publik?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q6"
                          name="q6"
                          value={formik.values.q6}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Kompeten"
                            label={<TextRadioCustom text="Tidak Kompeten" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Kompeten"
                            label={<TextRadioCustom text="Kurang Kompeten" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kompeten"
                            label={<TextRadioCustom text="Kompeten" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Kompeten"
                            label={<TextRadioCustom text="Sangat Kompeten" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q6 && formik.errors.q6}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q7  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q7 && Boolean(formik.errors.q7)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang perilaku petugas
                          dalam pelayanan informasi publik terkait kesopanan dan
                          keramahan?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q7"
                          name="q7"
                          value={formik.values.q7}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Sopan dan Ramah"
                            label={
                              <TextRadioCustom text="Tidak Sopan dan Ramah" />
                            }
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Sopan dan Ramah"
                            label={
                              <TextRadioCustom text="Kurang Sopan dan Ramah" />
                            }
                          />
                          <FormControlLabelRadioCustom
                            value="Sopan dan Ramah"
                            label={<TextRadioCustom text="Sopan dan Ramah" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Sopan dan Ramah"
                            label={
                              <TextRadioCustom text="Sangat Sopan dan Ramah" />
                            }
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q7 && formik.errors.q7}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q8  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q8 && Boolean(formik.errors.q8)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang kualitas sarana dan
                          prasarana pelayanan informasi publik?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q8"
                          name="q8"
                          value={formik.values.q8}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Buruk"
                            label={<TextRadioCustom text="Buruk" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Cukup"
                            label={<TextRadioCustom text="Cukup" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Baik"
                            label={<TextRadioCustom text="Baik" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Baik"
                            label={<TextRadioCustom text="Sangat Baik" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q8 && formik.errors.q8}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q9  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q9 && Boolean(formik.errors.q9)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang penanganan
                          pengaduan pengguna layanan informasi publik?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q9"
                          name="q9"
                          value={formik.values.q9}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Ada"
                            label={<TextRadioCustom text="Tidak Ada" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Ada Tetapi Tidak Berfungsi"
                            label={
                              <TextRadioCustom text="Ada Tetapi Tidak Berfungsi" />
                            }
                          />
                          <FormControlLabelRadioCustom
                            value="Berfungsi Tetapi Kurang Maksimal"
                            label={
                              <TextRadioCustom text="Berfungsi Tetapi Kurang Maksimal" />
                            }
                          />
                          <FormControlLabelRadioCustom
                            value="Dikelola Dengan Baik"
                            label={
                              <TextRadioCustom text="Dikelola Dengan Baik" />
                            }
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q9 && formik.errors.q9}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* q10  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={formik.touched.q10 && Boolean(formik.errors.q10)}
                      >
                        <FormLabelCustom>
                          Bagaimana pendapat Saudara tentang tingkat kepuasan
                          terhadap keseluruhan pelayanan informasi publik di
                          Bawaslu?
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="q10"
                          name="q10"
                          value={formik.values.q10}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Tidak Puas"
                            label={<TextRadioCustom text="Tidak Puas" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurang Puas"
                            label={<TextRadioCustom text="Kurang Puas" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Puas"
                            label={<TextRadioCustom text="Puas" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Sangat Puas"
                            label={<TextRadioCustom text="Sangat Puas" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.q10 && formik.errors.q10}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* Saran  */}
                    <div className="col-xs-12">
                      <TextFieldCustom
                        multiline
                        label="Saran"
                        name="saran"
                        value={formik.values.saran}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.saran && Boolean(formik.errors.saran)
                        }
                        helperText={formik.touched.saran && formik.errors.saran}
                      />
                    </div>
                  </div>

                  {/* SUBMIT  */}
                  <div className="row">
                    <div className="col-xs-12 col-lg-3">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
                        ref={recaptchaRef}
                        onChange={() => toast.dismiss()}
                      />
                    </div>
                    <div className="col-xs-12 col-lg-9">
                      <Button
                        style={{ marginTop: 10 }}
                        disabled={formik.isSubmitting}
                        type="submit"
                        variant="contained"
                      >
                        Kirim
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* Formulir End  */}
            <div className="clear" />
          </div>

          <div id="block-answer" ref={answerRef} style={{ marginTop: "30px" }}>
            <div
              style={{
                display: response ? "block" : "none",
              }}
            >
              <ResponseSurvey
                curData={formik.values}
                reset={() => {
                  setTimeout(() => {
                    formik.resetForm();
                    setResponse(false);
                  }, 500);
                  setTimeout(() => {
                    formRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 800);
                }}
              />
            </div>
          </div>

          <div className="clear" />
          <div className="legal-info col-md-12">
            <div className="text-center">
              <p>
                Pejabat Pengelola Informasi dan Dokumentasi Bawaslu Terintegrasi
              </p>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={loadPemohon.open}
        onClose={() =>
          setLoadPemohon((prev) => (prev = { ...loadPemohon, open: false }))
        }
        message={<p style={{ fontSize: 14 }}>{loadPemohon.message}</p>}
        action={action}
      />
    </>
  );
}

Survey.public = true;
export default Survey;
