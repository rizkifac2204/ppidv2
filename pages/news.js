import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
// MUI
import FormHelperText from "@mui/material/FormHelperText";
// COMPONENTS
import {
  FormControlCustom,
  InputLabelCustom,
  SelectCustom,
  MenuItemCustom,
} from "components/PublicComponents/FieldCustom";

const handleSubmit = (values, afterSubmit, setSubmitting) => {
  const toastProses = toast.loading("Tunggu Sebentar...");
  axios
    .post(`/api/public/subscribe`, values)
    .then((res) => {
      afterSubmit(res.data);
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
        render: "err.response.data.message",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    })
    .then(() => {
      setSubmitting(false);
    });
};

const validationSchema = yup.object({
  email: yup.string().email("Email Tidak Valid").required("Email Harus Diisi"),
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
});

const News = () => {
  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);
  const [initialValues, setInitialValues] = useState({
    email: "",
    kepada: "",
    id_prov: "",
    id_kabkota: "",
  });
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

  // formik dan submit
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values, afterSubmit, setSubmitting);
    },
  });
  const afterSubmit = (data) => {
    console.log(data);
    // formik.resetForm();
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

  return (
    <>
      <div id="news-popup">
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-newspaper-o fa-2x" />
              <br />
              <span className="point">Berlangganan</span> Berita Bawaslu.
            </h2>
            <p>
              Daftarkan email kamu dan dapatkan kabar terbaru yang akan kami
              kirimkan melalui email
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
        <div className="info-item" ref={formRef}>
          <div className="first-block">
            <div className="container">
              <div className="col-md-12">
                <h2>Dapatkan Berita Terupdate</h2>
              </div>
            </div>
          </div>

          <div className="newsletter-block">
            <div className="col-xs-12 col-sm-12 col-lg-5 block-left-newsletter">
              <i className="fa fa-bell" />
            </div>
            {/* .block-left-newsletter */}
            <div className="col-xs-12 col-sm-12 col-lg-7 block-right-newsletter">
              <div id="subscribe">
                <h2>Daftarkan Email</h2>
                <p>
                  Selalu update informasi terbaru dengan manjadi bagian dari
                  kami
                </p>
                <form id="notifyMe" onSubmit={formik.handleSubmit}>
                  <div className="row" style={{ marginBottom: "20px" }}>
                    {/* kepada  */}
                    <div className="col-xs-12 col-sm-4">
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
                        <div className="col-xs-12 col-sm-4">
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
                        <div className="col-xs-12 col-sm-4">
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
                  <div className="form-group">
                    <div className="controls">
                      <input
                        type="email"
                        name="email"
                        placeholder="Masukan Email"
                        className="form-control email srequiredField"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        disabled={formik.isSubmitting}
                        className="btn btn-lg submit"
                        type="submit"
                      >
                        Subscribe
                      </button>
                      <div className="clear" />
                    </div>
                  </div>
                  {formik.touched.email && Boolean(formik.errors.email) && (
                    <p>{formik.errors.email}</p>
                  )}
                </form>
              </div>
              {/* .subscribe */}
            </div>
            {/* .block-right-newsletter */}
            <div className="clear" />
            <div className="legal-info col-md-12">
              <div className="text-center">
                <p>
                  Pejabat Pengelola Informasi dan Dokumentasi Bawaslu
                  Terintegrasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

News.public = true;
export default News;
