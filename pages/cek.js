import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactToPrint } from "react-to-print";
// MUI
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
// COMPONENTS
import ResponseCek from "components/PublicComponents/ResponseCek";
import BuktiPermohonan from "components/PrintPage/BuktiPermohonan";
import { TextFieldCustom } from "components/PublicComponents/FieldCustom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const handleSubmit = (
  values,
  recaptchaRef,
  afterSubmit,
  setCurData,
  setSubmitting
) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi Captcha");
    setSubmitting(false);
    return;
  }
  setCurData(() => {});

  const toastProses = toast.loading("Tunggu Sebentar...", { autoClose: false });
  axios
    .post(`/api/public/cek`, values)
    .then((res) => {
      afterSubmit(res.data);
      toast.update(toastProses, {
        render: "Ditemukan",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .catch((err) => {
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
  tiket: yup.string().required("Harus Diisi"),
  email_pemohon: yup
    .string()
    .email("Email Tidak Valid")
    .required("Harus Diisi"),
});

const Cek = () => {
  const [curData, setCurData] = useState({});
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const [initialValues, setInitialValues] = useState({
    tiket: "",
    email_pemohon: "",
  });
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [loadByQuery, setLoadByQuery] = useState({
    open: false,
    message: "",
    severity: "",
  });

  // useRef
  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const formRef = useRef(null);
  const printBuktiRef = useRef();

  // proses panggil data secara langsung dengan query
  useEffect(() => {
    // panggil langsung data jika terdapat query email dan tiket
    const { email, ticket } = router.query;
    if (!email) return;
    if (!ticket) return;
    // siapkan snackbar
    setLoadByQuery({
      open: true,
      message: "Loading...",
      severity: "info",
    });
    // siapkan postdata
    const datapost = {
      tiket: ticket,
      email_pemohon: email,
    };
    // isi form default
    setInitialValues(() => datapost);
    axios
      .post(`/api/public/cek`, datapost)
      .then((res) => {
        afterSubmit(res.data);
        setLoadByQuery({
          open: true,
          message: "Ditemukan Detail Permohonan Informasi",
          severity: "success",
        });
      })
      .catch((err) => {
        setLoadByQuery({
          open: true,
          message: "Tidak Ditemukan",
          severity: "error",
        });
      });
  }, [router]);

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

  const afterSubmit = (data) => {
    setCurData(() => data);
    setTimeout(() => {
      answerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 1000);
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(
        values,
        recaptchaRef,
        afterSubmit,
        setCurData,
        setSubmitting
      ),
  });

  return (
    <>
      <div id="formulir-popup" style={{ overflowY: "auto", height: "100%" }}>
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-file-text fa-2x" />
              <br />
              <span className="point">Formulir</span> Cek Permohonan Informasi
            </h2>
            <p>
              Isi Formulir untuk melakukan Cek Status Permohonan Informasi.
              Pelayanan Kantor pukul 08:00 AM s.d 16:00 PM. Kamu juga dapat
              melakukan cek status permohonan dengan menghubungi Nomor
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
          <div className="newsletter-block">
            {/* Formulir Start  */}
            <div className="col-xs-12 block-right-newsletter" ref={formRef}>
              <div id="subscribe">
                <h2>Formulir Cek Pemohonan Informasi</h2>
                <p>Isi Data Tiket dan Email</p>

                <form
                  onSubmit={formik.handleSubmit}
                  id="contact-form"
                  style={{ marginTop: "20px" }}
                >
                  <div className="row">
                    {/* tiket */}
                    <div className="col-xs-12">
                      <TextFieldCustom
                        label="Tiket"
                        name="tiket"
                        value={formik.values.tiket}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.tiket && Boolean(formik.errors.tiket)
                        }
                        helperText={formik.touched.tiket && formik.errors.tiket}
                      />
                    </div>

                    {/* email  */}
                    <div className="col-xs-12">
                      <TextFieldCustom
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
                          formik.touched.email_pemohon &&
                          formik.errors.email_pemohon
                        }
                      />
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
                        Cari
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
                <ResponseCek
                  curData={curData}
                  handlePrint={handlePrint}
                  reset={() => {
                    setTimeout(() => {
                      setCurData({});
                    }, 500);
                    formRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
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
        open={loadByQuery.open}
        autoHideDuration={5000}
        onClose={() =>
          setLoadByQuery((prev) => (prev = { ...loadByQuery, open: false }))
        }
      >
        <Alert
          onClose={() =>
            setLoadByQuery((prev) => (prev = { ...loadByQuery, open: false }))
          }
          severity={loadByQuery.severity}
          sx={{ width: "100%" }}
        >
          <p style={{ fontSize: 14 }}>{loadByQuery.message}</p>
        </Alert>
      </Snackbar>
    </>
  );
};

Cek.public = true;
export default Cek;
