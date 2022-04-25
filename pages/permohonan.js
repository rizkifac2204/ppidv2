import React, { useRef, useState, useEffect } from "react";
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
import Input from "@mui/material/Input";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// COMPONENTS
import Thumb from "components/Thumb";
import ResponsePermohonan from "components/PublicComponents/ResponsePermohonan";
import BuktiPermohonan from "components/PrintPage/BuktiPermohonan";

let styles = {
  marginBottom: "20px",
};

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
  // nama_pemohon: yup.string("Masukan Nama").required("Harus Diisi"),
  // pekerjaan_pemohon: yup.string("Masukan Pekerjaan").required("Harus Diisi"),
  // pendidikan_pemohon: yup.string("Masukan Pendidikan").required("Harus Diisi"),
  // telp_pemohon: yup.string("Masukan Telp/HP").required("Telp Harus Diisi"),
  // alamat_pemohon: yup.string().required("Alamat Harus Diisi"),
  // kepada: yup.string().required("Harus Diisi"),
  // id_prov: yup.number().when("kepada", {
  //   is: (kepada) => kepada !== "Bawaslu Republik Indonesia",
  //   then: yup.number().required("Provinsi Harus Dipilih"),
  //   otherwise: yup.number(),
  // }),
  // id_kabkota: yup.number().when("kepada", {
  //   is: (kepada) => kepada === "Bawaslu",
  //   then: yup.number().required("Kabupaten/Kota Harus Diisi"),
  //   otherwise: yup.number(),
  // }),
  // rincian: yup.string().required("Harus Diisi"),
  // tujuan: yup.string().required("Harus Diisi"),
  // cara_terima: yup.string().required("Harus Diisi"),
  // cara_dapat: yup.string().required("Harus Diisi"),
  // identitas_pemohon: yup.string(),
  // file: yup
  //   .mixed()
  //   .test(
  //     "FILE_SIZE",
  //     "Ukuran Gambar Melebihi 4mb.",
  //     (value) => !value || (value && value.size <= 4194304) // 4 mb
  //   )
  //   .test(
  //     "FILE_FORMAT",
  //     "Format Gambar Tidak Sesuai.",
  //     (value) =>
  //       !value ||
  //       (value &&
  //         [
  //           "image/jpeg",
  //           "image/jpg",
  //           "image/png",
  //           "image/gif",
  //           "image/bmp",
  //         ].includes(value.type))
  //   )
  //   .when("identitas_pemohon", {
  //     is: (identitas_pemohon) => !identitas_pemohon,
  //     then: yup.mixed().required("Harus Upload"),
  //     otherwise: yup.mixed(),
  //   }),
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
    // nama_pemohon: "",
    // pekerjaan_pemohon: "",
    // pendidikan_pemohon: "",
    // telp_pemohon: "",
    // alamat_pemohon: "",
    // kepada: "",
    // id_prov: "",
    // id_kabkota: "",
    // rincian: "",
    // tujuan: "",
    // cara_terima: "",
    // cara_dapat: "",
    // identitas_pemohon: "",
    // file: null,
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
    // formik.setFieldValue("id_kabkota", "");
    if (formik.values.kepada !== "Bawaslu Republik Indonesia") fetchProv();
  }, [formik.values.kepada]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // formik.setFieldValue("id_kabkota", "");
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
    <div id="formulir-popup" className="content-popup mfp-hide">
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
        <button className="scroll-chevron">
          <i className="fa fa-chevron-down fa-2x" />
        </button>
      </div>
      <div className="info-item">
        <div className="">
          <div className="newsletter-block">
            {/* Formulir Start  */}
            <div className="col-xs-12 block-right-newsletter">
              <div id="subscribe">
                <h2>Formulir Pemohonan Informasi</h2>
                <p>Isi Data Dengan Lengkap dan Jelas</p>
                <form onSubmit={formik.handleSubmit} id="contact-form">
                  {/* Email  */}
                  <input
                    required
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email_pemohon"
                    value={formik.values.email_pemohon}
                    onChange={(e) => console.log("ok")}
                    // onChange={formik.handleChange}
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      getPemohonByEmail(e);
                    }}
                  />
                  <div className="col-xs-12 no-padding">
                    <div className="form-group">
                      <p className="error-field">
                        {JSON.stringify(formik, 2, null)}
                      </p>
                    </div>
                  </div>
                  {/* Button submit */}
                  <button
                    disabled={formik.isSubmitting}
                    type="submit"
                    id="valid-form"
                    className="btn btn-large"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            </div>
            {/* Formulir End  */}
            <div className="clear" />
            <div className="legal-info col-md-12">
              <div className="text-center">
                <p>
                  * You will be alerted 1 day before the launch, your e-mail
                  will be used only for this alert.
                </p>
              </div>
            </div>
            {/* .legal-info */}
          </div>
          <div className="clear" />
        </div>
      </div>
    </div>
  );
};

Permohonan.public = true;
Permohonan.dynamic = false;
export default Permohonan;
