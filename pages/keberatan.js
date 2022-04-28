import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactToPrint } from "react-to-print";
// MUI
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
// CMPONENTS
import BuktiPengajuanKeberatan from "components/PrintPage/BuktiPengajuanKeberatan";
import ResponseKeberatan from "components/PublicComponents/ResponseKeberatan";
import {
  TextFieldCustom,
  CheckBoxCustom,
  CheckBoxTex,
} from "components/PublicComponents/FieldCustom";

function isTrue(element, index, array) {
  return element;
}

const handleSubmit = (
  values,
  data,
  recaptchaRef,
  afterSubmit,
  setSubmitting
) => {
  const arr = ["a", "b", "c", "d", "e", "f", "g"];
  const temArr = [];
  arr.map((item) => {
    temArr.push(values[`alasan_${item}`]);
  });
  if (!temArr.some(isTrue)) {
    toast.error("Pilih Minimal 1 Alasan Keberatan");
    setSubmitting(false);
    return;
  }
  const postValues = {
    ...values,
    id: data.id,
    no_registrasi: data.no_registrasi,
    email_pemohon: data.email_pemohon,
    email_bawaslu: data.email_bawaslu,
  };
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi Captcha");
    setSubmitting(false);
    return;
  }

  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/public/keberatan`, postValues)
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
  kasus_posisi: yup.string().required("Harus Diisi"),
});

function Keberatan() {
  const [data, setData] = useState({});
  const [curData, setCurData] = useState({});
  const [regOrTiket, setRegOrTiket] = useState("");
  // useRef
  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const formAwalRef = useRef(null);
  const formRef = useRef(null);
  const printBuktiRef = useRef();

  const handleGetData = (e) => {
    e.preventDefault();
    const toastProses = toast.loading("Mencari Data...");
    axios
      .get(`/api/public/keberatan?nomor=${regOrTiket}`)
      .then((res) => {
        setData(() => res.data);
        formRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        toast.update(toastProses, {
          render: "Ditemukan, Lanjutkan Mengisi Formulir",
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
      });
  };

  // PRINT
  const handlePrint = () => {
    processPrintBukti();
  };
  const processPrintBukti = useReactToPrint({
    content: () => printBuktiRef.current,
  });

  const afterSubmit = (resData) => {
    const curTemp = { ...data, ...resData };
    setCurData(() => curTemp);
    formik.resetForm();
    answerRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const formik = useFormik({
    initialValues: {
      alasan_a: false,
      alasan_b: false,
      alasan_c: false,
      alasan_d: false,
      alasan_e: false,
      alasan_f: false,
      alasan_g: false,
      kasus_posisi: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setCurData({});
      handleSubmit(values, data, recaptchaRef, afterSubmit, setSubmitting);
    },
  });

  return (
    <>
      <div id="formulir-popup" style={{ overflowY: "auto", height: "100%" }}>
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-file-text fa-2x" />
              <br />
              <span className="point">Formulir</span> Pengajuan Keberatan
            </h2>
            <p>
              Isi Formulir untuk melakukan Pengajuan Keberatan. Pelayanan Kantor
              pukul 08:00 AM s.d 16:00 PM. Kamu juga dapat melakukan pengajuan
              keberatan dengan menghubungi Nomor masing-masing Bawaslu
            </p>
          </div>
          {/* .item-title */}
          <button
            className="scroll-chevron"
            onClick={() => {
              formAwalRef.current.scrollIntoView({
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
            <div className="col-xs-12 block-right-newsletter" ref={formAwalRef}>
              <div id="subscribe">
                <h2>Formulir Pengajuan Keberatan</h2>
                <p>Isi Data Dengan Lengkap dan Jelas</p>

                <form onSubmit={handleGetData}>
                  <div className="row">
                    <div className="col-xs-10">
                      <TextFieldCustom
                        label="Nomor Registrasi / Nomor Tiket"
                        name="regOrTiket"
                        value={regOrTiket}
                        onChange={(e) => {
                          setRegOrTiket(e.target.value);
                          setData({});
                          formik.resetForm();
                        }}
                      />
                    </div>
                    <div className="col-xs-2" style={{ marginTop: 30 }}>
                      {data && Object.keys(data).length === 0 && (
                        <Button
                          type="submit"
                          variant="contained"
                          className="btn btn-info"
                        >
                          Cari
                        </Button>
                      )}
                    </div>
                  </div>
                </form>

                <div className="clear" />

                {data && Object.keys(data).length !== 0 && (
                  <form
                    ref={formRef}
                    onSubmit={formik.handleSubmit}
                    id="contact-form"
                    style={{ marginTop: "20px" }}
                  >
                    <div className="row">
                      <div className="col-xs-12">
                        <p> A. INFORMASI PENGAJUAN KEBERATAN</p>
                      </div>

                      {/* rincian  */}
                      <div className="col-xs-12">
                        <TextFieldCustom
                          disabled
                          multiline
                          label="Rincian Informasi"
                          name="rincian"
                          value={data.rincian}
                        />
                      </div>

                      {/* tujuan  */}
                      <div className="col-xs-12">
                        <TextFieldCustom
                          disabled
                          multiline
                          label="Tujuan Informasi"
                          name="tujuan"
                          value={data.tujuan}
                        />
                      </div>

                      <div className="col-xs-12" style={{ marginTop: "20px" }}>
                        <p>Identitas Pemohon</p>
                      </div>

                      {/* nama */}
                      <div className="col-xs-12 col-sm-6">
                        <TextFieldCustom
                          disabled
                          label="Nama"
                          name="nama_pemohon"
                          value={data.nama_pemohon}
                        />
                      </div>

                      {/* pekerjaan  */}
                      <div className="col-xs-12 col-sm-6">
                        <TextFieldCustom
                          disabled
                          label="Pekerjaan"
                          name="pekerjaan_pemohon"
                          value={data.pekerjaan_pemohon}
                        />
                      </div>

                      <div className="col-xs-12 col-sm-6">
                        <TextFieldCustom
                          disabled
                          label="Telp/Hp"
                          name="telp_pemohon"
                          value={data.telp_pemohon}
                        />
                      </div>

                      {/* alamat  */}
                      <div className="col-xs-12">
                        <TextFieldCustom
                          disabled
                          multiline
                          label="Alamat"
                          name="alamat_pemohon"
                          value={data.alamat_pemohon}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12" style={{ marginTop: "20px" }}>
                        <p>B. ALASAN PENGAJUAN KEBERATAN</p>
                      </div>
                      <div className="col-xs-12" style={{ marginTop: "10px" }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_a"
                                checked={formik.values.alasan_a}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex text="Permohonan Informasi ditolak" />
                            }
                          />
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_b"
                                checked={formik.values.alasan_b}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex text="Informasi berkala tidak disediakan" />
                            }
                          />
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_c"
                                checked={formik.values.alasan_c}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex text="Permintaan Informasi tidak ditanggapi" />
                            }
                          />
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_d"
                                checked={formik.values.alasan_d}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex
                                text="Permintaan Informasi ditanggapi tidak sebagaimana yang
                              diminta"
                              />
                            }
                          />
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_e"
                                checked={formik.values.alasan_e}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex text="Permintaan Informasi tidak dipenuhi" />
                            }
                          />
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_f"
                                checked={formik.values.alasan_f}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex text="Biaya yang dikenakan tidak wajar" />
                            }
                          />
                          <FormControlLabel
                            control={
                              <CheckBoxCustom
                                name="alasan_g"
                                checked={formik.values.alasan_g}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  toast.dismiss();
                                }}
                              />
                            }
                            label={
                              <CheckBoxTex
                                text="Informasi disampaikan melebihi jangka waktu yang
                              ditentukan"
                              />
                            }
                          />
                        </FormGroup>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12" style={{ marginTop: "20px" }}>
                        <p>C. KASUS POSISI</p>
                      </div>

                      {/* kasus posisi  */}
                      <div className="col-xs-12">
                        <TextFieldCustom
                          multiline
                          rows={4}
                          label="Kasus Posisi"
                          name="kasus_posisi"
                          value={formik.values.kasus_posisi}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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
                          Kirim
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
            {/* Formulir End  */}
            <div className="clear" />
          </div>

          <div ref={answerRef}>
            {curData && Object.keys(curData).length !== 0 && (
              <>
                <ResponseKeberatan
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

                <BuktiPengajuanKeberatan
                  ref={printBuktiRef}
                  detail={curData}
                  profileBawaslu={data}
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
    </>
  );
}

Keberatan.public = true;
export default Keberatan;
