import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useReactToPrint } from "react-to-print";
// MUI
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
// CMPONENTS
import BuktiPengajuanKeberatan from "components/PrintPage/BuktiPengajuanKeberatan";
import ResponseKeberatan from "components/PublicComponents/ResponseKeberatan";

function isTrue(element, index, array) {
  return element;
}

const handleSubmit = (values, data, recaptchaRef, afterSubmit, setCurData) => {
  const arr = ["a", "b", "c", "d", "e", "f", "g"];
  const temArr = [];
  arr.map((item) => {
    temArr.push(values[`alasan_${item}`]);
  });
  if (!temArr.some(isTrue)) {
    toast.error("Pilih Minimal 1 Alasan Keberatan");
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
    return;
  }
  setCurData(() => {});

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
      if (recaptchaRef.current) recaptchaRef.current.reset();
    });
};

const validationSchema = yup.object({
  kasus_posisi: yup.string().required("Harus Diisi"),
});

function Keberatan({ isUser = "Kosong" }) {
  const [data, setData] = useState({});
  const [curData, setCurData] = useState({});
  const [noRegistrasi, setNoRegistrasi] = useState("");
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const recaptchaRef = useRef(null);
  const printBuktiRef = useRef(null);
  const answerRef = useRef(null);

  const handleGetData = (e) => {
    e.preventDefault();
    const toastProses = toast.loading("Mencari Data...");
    axios
      .get(`/api/public/keberatan?no_registrasi=${noRegistrasi}`)
      .then((res) => {
        console.log(res.data);
        setData(() => res.data);
        toast.update(toastProses, {
          render: "Ditemukan, Lanjutkan Mengisi Formulir",
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
      });
  };

  const captchaChange = () => {
    toast.dismiss();
  };

  // PRINT
  // const fetchProfileBawaslu = (callback) => {
  //   const toastProses = toast.loading("Menyiapkan Format...");
  //   axios
  //     .get(`/api/permohonan/profileBawaslu?id=` + curData.bawaslu_id)
  //     .then((res) => {
  //       setProfileBawaslu(res.data);
  //       toast.dismiss(toastProses);
  //       callback();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.update(toastProses, {
  //         render: "Terjadi Kesalahan",
  //         type: "error",
  //         isLoading: false,
  //         autoClose: 2000,
  //       });
  //     });
  // };
  const handlePrint = () => {
    // return fetchProfileBawaslu(() => {
    // });
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
    onSubmit: (values) =>
      handleSubmit(values, data, recaptchaRef, afterSubmit, setCurData),
  });

  return (
    <div id="block-form">
      <div
        style={{
          display:
            curData && Object.keys(curData).length === 0 ? "block" : "none",
        }}
      >
        <h2>Formulir Pengajuan Keberatan</h2>

        <p>
          Isi Formulir untuk melakukan Pengajuan Keberatan <br />
          <strong>Pelayanan Kantor</strong> pukul 08:00 AM s.d 16:00 PM. Kamu
          juga dapat melakukan permohonan dengan menghubungi 08777.
        </p>

        <form onSubmit={handleGetData}>
          <div className="row">
            <div className="col-xs-10">
              <TextField
                required
                fullWidth
                margin="normal"
                label="Nomor Registrasi"
                name="noRegistrasi"
                value={noRegistrasi}
                onChange={(e) => {
                  setNoRegistrasi(e.target.value);
                  setData({});
                  formik.resetForm();
                }}
                inputProps={{ style: { fontSize: 14 } }}
                InputLabelProps={{ style: { fontSize: 14 } }}
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

        {data && Object.keys(data).length !== 0 && (
          <form onSubmit={formik.handleSubmit}>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                <div className="form-group">
                  <h4>A. INFORMASI PENGAJUAN KEBERATAN </h4>
                </div>
              </div>

              {/* rincian  */}
              <div className="col-xs-12">
                <TextField
                  disabled
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  label="Rincian Informasi"
                  name="rincian"
                  value={data.rincian}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              {/* tujuan  */}
              <div className="col-xs-12">
                <TextField
                  disabled
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  label="Tujuan Informasi"
                  value={data.tujuan}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              <div className="col-xs-12" style={{ marginTop: "20px" }}>
                <div className="form-group">
                  <h4>Identitas Pemohon </h4>
                </div>
              </div>
              {/* nama */}
              <div className="col-xs-12 col-sm-6">
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  label="Nama"
                  name="nama_pemohon"
                  value={data.nama_pemohon}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              {/* pekerjaan  */}
              <div className="col-xs-12 col-sm-6">
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  label="Pekerjaan"
                  name="pekerjaan_pemohon"
                  value={data.pekerjaan_pemohon}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              {/* telp  */}
              <div className="col-xs-12 col-sm-6">
                <TextField
                  disabled
                  fullWidth
                  margin="normal"
                  label="Telp/Hp"
                  name="telp_pemohon"
                  value={data.telp_pemohon}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
              {/* alamat  */}
              <div className="col-xs-12">
                <TextField
                  disabled
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  label="Alamat"
                  name="alamat_pemohon"
                  value={data.alamat_pemohon}
                  inputProps={{ style: { fontSize: 14 } }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                <div className="form-group">
                  <h4>B. ALASAN PENGAJUAN KEBERATAN </h4>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_a"
                        checked={formik.values.alasan_a}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={<p>Permohonan Informasi ditolak</p>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_b"
                        checked={formik.values.alasan_b}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={<p>Informasi berkala tidak disediakan</p>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_c"
                        checked={formik.values.alasan_c}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={<p>Permintaan Informasi tidak ditanggapi</p>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_d"
                        checked={formik.values.alasan_d}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={
                      <p>
                        Permintaan Informasi ditanggapi tidak sebagaimana yang
                        diminta
                      </p>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_e"
                        checked={formik.values.alasan_e}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={<p>Permintaan Informasi tidak dipenuhi</p>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_f"
                        checked={formik.values.alasan_f}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={<p>Biaya yang dikenakan tidak wajar</p>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 22 } }}
                        name="alasan_g"
                        checked={formik.values.alasan_g}
                        onChange={(e) => {
                          formik.handleChange(e);
                          toast.dismiss();
                        }}
                      />
                    }
                    label={
                      <p>
                        Informasi disampaikan melebihi jangka waktu yang
                        ditentukan
                      </p>
                    }
                  />
                </FormGroup>
              </div>
            </div>
            <div className="row" style={{ marginTop: "20px" }}>
              <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                <div className="form-group">
                  <h4>C. KASUS POSISI </h4>
                </div>
              </div>
              {/* kasus  */}
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  margin="normal"
                  label="Kasus Posisi"
                  name="kasus_posisi"
                  value={formik.values.kasus_posisi}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.kasus_posisi &&
                    Boolean(formik.errors.kasus_posisi)
                  }
                  helperText={
                    formik.touched.kasus_posisi && formik.errors.kasus_posisi
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
        )}
      </div>

      <div id="block-answer" ref={answerRef}>
        {curData && Object.keys(curData).length !== 0 && (
          <ResponseKeberatan curData={curData} handlePrint={handlePrint} />
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
            Ajukan Keberatan Kembali
          </Button>
        </div>
      </div>

      {curData && Object.keys(curData).length !== 0 && (
        <BuktiPengajuanKeberatan
          ref={printBuktiRef}
          detail={curData}
          profileBawaslu={data}
        />
      )}
    </div>
  );
}

Keberatan.public = true;
export default Keberatan;
