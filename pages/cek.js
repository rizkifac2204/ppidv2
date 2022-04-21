import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
// MUI
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// COMPONENTS
import BuktiPermohonan from "components/PrintPage/BuktiPermohonan";

function getValueResponse(obj, param, download) {
  if (!obj.responses) return "Tidak Tersedia";
  if (obj.responses[0][param]) {
    if (download) {
      return (
        <a
          className="phone-mail-link"
          href={`/${download}/${obj.responses[0][param]}`}
          download
        >
          <i className="fa fa-download"></i>
        </a>
      );
    } else {
      return obj.responses[0][param];
    }
  }
  return "Tidak Ditemukan";
}

const handleSubmit = (values, recaptchaRef, afterSubmit, setCurData) => {
  const recaptchaValue = recaptchaRef.current.getValue();
  if (!recaptchaValue) {
    toast.info("Mohon Validasi Captcha");
    return;
  }
  setCurData(() => {});

  const toastProses = toast.loading("Tunggu Sebentar...");
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

function Cek() {
  const [curData, setCurData] = useState({});
  const [profileBawaslu, setProfileBawaslu] = useState({});

  const recaptchaRef = useRef(null);
  const answerRef = useRef(null);
  const printBuktiRef = useRef();

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
        console.log(err.data);
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

  const formik = useFormik({
    initialValues: {
      tiket: "",
      email_pemohon: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) =>
      handleSubmit(values, recaptchaRef, afterSubmit, setCurData),
  });

  return (
    <div id="block-form">
      <h2>Formulir Cek Permohoan Informasi</h2>

      <p>
        Isi Formulir untuk melakukan pengecekan Permohonan Informasi <br />
        <strong>Pelayanan Kantor</strong> pukul 08:00 AM s.d 16:00 PM. Kamu juga
        dapat melakukan permohonan dengan menghubungi 08777.
      </p>

      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          {/* tiket  */}
          <div className="col-xs-12">
            <TextField
              fullWidth
              required
              margin="normal"
              label="Nomor Tiket"
              name="tiket"
              value={formik.values.tiket}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tiket && Boolean(formik.errors.tiket)}
              helperText={formik.touched.tiket && formik.errors.tiket}
              inputProps={{ style: { fontSize: 14 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
            />
          </div>
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
            <Button type="submit" variant="contained" className="btn btn-info">
              Cek Permohonan
            </Button>
          </div>
        </div>
      </form>

      <div id="block-answer" ref={answerRef} style={{ paddingTop: "20px" }}>
        {curData && Object.keys(curData).length !== 0 && (
          <>
            <h4>
              Berikut Data Permohonan Informasi dengan Nomor Tiket{" "}
              <b>{curData.tiket}</b>
            </h4>
            <div className="table-responsive">
              <table
                className="table"
                style={{ fontSize: "14px", fontStyle: "normal" }}
              >
                <tbody>
                  <tr>
                    <td>Nomor Registrasi</td>
                    <td>
                      <b>{curData.no_registrasi}</b>
                      {!curData.no_registrasi && <>Saat ini belum tersedia</>}
                    </td>
                  </tr>
                  <tr>
                    <td>Ditujukan Kepada</td>
                    <td>
                      <b>{curData.nama_bawaslu}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Rincian Informasi</td>
                    <td>{curData.rincian}</td>
                  </tr>
                  <tr>
                    <td>Tujuan Informasi</td>
                    <td>{curData.tujuan}</td>
                  </tr>
                  <tr>
                    <td>Status Permohonan</td>
                    <td>{curData.status_permohonan}</td>
                  </tr>
                  <tr>
                    <td>Cetak Bukti Permohonan</td>
                    <td>
                      <a
                        className="phone-mail-link"
                        onClick={() => handlePrint()}
                      >
                        <i>Cetak</i>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Surat Pemberitahuan</td>
                    <td>
                      {getValueResponse(
                        curData,
                        "file_surat_pemberitahuan",
                        "pemberitahuan"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>File Informasi</td>
                    <td>
                      {getValueResponse(curData, "file_informasi", "response")}
                    </td>
                  </tr>
                  <tr>
                    <td>Pesan</td>
                    <td>{getValueResponse(curData, "pesan")}</td>
                  </tr>
                  <tr>
                    <td>Jumlah Response</td>
                    <td>{curData.responses ? curData.responses.length : 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            Anda akan mendapatkan email ketika perubahan status dilakukan admin,
            atau anda bisa melakukan pengecekan kembali dihalaman ini.
            <br />
            Jika anda keberatan dengan jabawan/response kami, anda bisa
            mengajukan keberatan dengan mengisi form melalui link berikut{" "}
            <Link href="/keberatan">
              <a className="phone-mail-link">Formulir Pengajuan Keberatan</a>
            </Link>
            <br />
            Terimakasih.
          </>
        )}
        {curData && Object.keys(curData).length !== 0 && (
          <div>
            <BuktiPermohonan
              ref={printBuktiRef}
              detail={curData}
              profileBawaslu={profileBawaslu}
            />
          </div>
        )}
      </div>
    </div>
  );
}

Cek.public = true;
export default Cek;
