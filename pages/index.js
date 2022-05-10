import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactToPrint } from "react-to-print";
// MUI
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import RadioGroup from "@mui/material/RadioGroup";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// COMPONENTS
import Thumb from "components/Thumb";
import ResponsePermohonan from "components/PublicComponents/ResponsePermohonan";
import BuktiPermohonan from "components/PrintPage/BuktiPermohonan";
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
    .post(`/api/public/permohonan`, form, {
      headers: {
        "content-type": "multipart/form-data",
        destinationfile: "upload",
      },
      onUploadProgress: (event) => {
        // console.log(
        //   `Current progress:`,
        //   Math.round((event.loaded * 100) / event.total)
        // );
      },
    })
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
      if (err.response.data.currentData) {
        formik.setFieldValue(
          "identitas_pemohon",
          err.response.data.currentData.identitas_pemohon
        );
      }
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

const Index = () => {
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
  const formRef = useRef(null);
  const printBuktiRef = useRef();

  // fetching wilayah
  const fetchProv = (cb) => {
    if (provinsis.length !== 0) {
      if (cb) cb();
      return;
    }
    axios
      .get(`/api/services/provinsis-selected`)
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
      .get(`/api/services/provinsis-selected/` + id)
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
    if (data.identitas_pemohon) {
      formik.setFieldValue("identitas_pemohon", data.identitas_pemohon);
    }
    setTimeout(() => {
      answerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 1000);
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
    <>
      <div id="formulir-popup" style={{ overflowY: "auto", height: "100%" }}>
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-file-text fa-2x" />
              <br />
              <span className="point">Formulir</span> Permohonan Informasi
            </h2>
            <p>
              Isi Formulir untuk melakukan Pengajuan Permohonan Informasi.
              Pelayanan Kantor pukul 08:00 AM s.d 16:00 PM. Kamu juga dapat
              melakukan pengajuan permohonan dengan menghubungi Nomor
              masing-masing Bawaslu
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
          <div
            className="newsletter-block"
            style={{
              display:
                curData && Object.keys(curData).length === 0 ? "block" : "none",
            }}
          >
            {/* Formulir Start  */}
            <div className="col-xs-12 block-right-newsletter" ref={formRef}>
              <div id="subscribe">
                <h2>Formulir Pemohonan Informasi</h2>
                <p>Isi Data Dengan Lengkap dan Jelas</p>

                <form
                  onSubmit={formik.handleSubmit}
                  id="contact-form"
                  style={{ marginTop: "20px" }}
                >
                  <div className="row">
                    {/* email  */}
                    <div className="col-xs-12">
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

                    {/* telp  */}
                    <div className="col-xs-12 col-sm-6">
                      <TextFieldCustom
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
                          formik.touched.telp_pemohon &&
                          formik.errors.telp_pemohon
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

                    {/* rincian  */}
                    <div className="col-xs-12">
                      <TextFieldCustom
                        multiline
                        rows={4}
                        label="Rincian Informasi"
                        name="rincian"
                        value={formik.values.rincian}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.rincian &&
                          Boolean(formik.errors.rincian)
                        }
                        helperText={
                          formik.touched.rincian && formik.errors.rincian
                        }
                      />
                    </div>

                    {/* tujuan  */}
                    <div className="col-xs-12">
                      <TextFieldCustom
                        multiline
                        rows={4}
                        label="Tujuan Informasi"
                        name="tujuan"
                        value={formik.values.tujuan}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.tujuan && Boolean(formik.errors.tujuan)
                        }
                        helperText={
                          formik.touched.tujuan && formik.errors.tujuan
                        }
                      />
                    </div>

                    {/* cara terima  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={
                          formik.touched.cara_terima &&
                          Boolean(formik.errors.cara_terima)
                        }
                      >
                        <FormLabelCustom>
                          Cara Memperoleh Informasi *
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="cara_terima"
                          name="cara_terima"
                          value={formik.values.cara_terima}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Melihat/Membaca/Mendengarkan/Mencatat"
                            label={
                              <TextRadioCustom text="Melihat/Membaca/Mendengarkan/Mencatat" />
                            }
                          />
                          <FormControlLabelRadioCustom
                            value="Mendapatkan salinan Informasi (hardcopy/softcopy)"
                            label={
                              <TextRadioCustom text="Mendapatkan salinan Informasi (hardcopy/softcopy)" />
                            }
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.cara_terima &&
                            formik.errors.cara_terima}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* cara dapat  */}
                    <div className="col-xs-12">
                      <FormControlCustom
                        component="fieldset"
                        error={
                          formik.touched.cara_dapat &&
                          Boolean(formik.errors.cara_dapat)
                        }
                      >
                        <FormLabelCustom>
                          Cara Mendapatkan Salinan Informasi *
                        </FormLabelCustom>
                        <RadioGroup
                          aria-label="cara_dapat"
                          name="cara_dapat"
                          value={formik.values.cara_dapat}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabelRadioCustom
                            value="Mengambil Langsung"
                            label={
                              <TextRadioCustom text="Mengambil Langsung" />
                            }
                          />
                          <FormControlLabelRadioCustom
                            value="Pos"
                            label={<TextRadioCustom text="Pos" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Email"
                            label={<TextRadioCustom text="Email" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Kurir"
                            label={<TextRadioCustom text="Kurir" />}
                          />
                          <FormControlLabelRadioCustom
                            value="Faksimili"
                            label={<TextRadioCustom text="Faksimili" />}
                          />
                        </RadioGroup>
                        <FormHelperText>
                          {formik.touched.cara_dapat &&
                            formik.errors.cara_dapat}
                        </FormHelperText>
                      </FormControlCustom>
                    </div>

                    {/* tanda pengenal */}
                    <div className="col-xs-12" style={{ marginTop: "10px" }}>
                      <Thumb
                        file={
                          formik.values.file
                            ? formik.values.file
                            : formik.values.identitas_pemohon
                        }
                      />
                      <div className="form-group">
                        <FormLabelCustom>
                          {loadPemohon.used
                            ? "Biarkan atau Upload ulang jika ingin mengganti Tanda Pengenal"
                            : "Upload Tanda Pengenal"}
                        </FormLabelCustom>
                        <input
                          style={{ marginBottom: 2 }}
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
                        <FormHelperText style={{ color: "red" }}>
                          {formik.touched.file && formik.errors.file}
                        </FormHelperText>
                      </div>
                    </div>
                  </div>
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

          <div ref={answerRef}>
            {curData && Object.keys(curData).length !== 0 && (
              <>
                <ResponsePermohonan
                  curData={curData}
                  handlePrint={handlePrint}
                  reset={() => {
                    setTimeout(() => {
                      setCurData({});
                    }, 500);
                    setTimeout(() => {
                      formRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 800);
                  }}
                />
                <BuktiPermohonan
                  ref={printBuktiRef}
                  detail={curData}
                  profileBawaslu={profileBawaslu}
                />
              </>
            )}
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
};

Index.public = true;
export default Index;
