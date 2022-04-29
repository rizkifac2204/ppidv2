import { useRef, useState, useEffect } from "react";
import axios from "axios";
import GoogleMapReact from "google-map-react";
import PerfectScrollbar from "react-perfect-scrollbar";
// MUI
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const DetailBox = ({ detail, modal }) => {
  return (
    <div className="block-services" style={{ paddingTop: 0 }}>
      <div className="col-xs-12">
        <div className="item-service">
          <i className="fa fa-university" />
          <h4>{detail.nama_bawaslu}</h4>
          <span className="border-service" />
          <p className="text-left" style={modal && { lineHeight: 1.5 }}>
            Bawaslu : {detail.nama_bawaslu}
            <br />
            Alamat : {detail.alamat_bawaslu}
            <br />
            Telp : {detail.telp_bawaslu}
            <br />
            Email : {detail.email_bawaslu}
            <br />
            Website :{" "}
            {detail.web_profile && (
              <a href={detail.web_profile} target="_blank" rel="noreferrer">
                Kunjungi Website
              </a>
            )}
            <br />
            PPID :{" "}
            {detail.web_ppid && (
              <a href={detail.web_ppid} target="_blank" rel="noreferrer">
                Kunjungi PPID
              </a>
            )}
            <br />
            Facebook :{" "}
            {detail.facebook && (
              <a href={detail.facebook} target="_blank" rel="noreferrer">
                Kunjungi Laman
              </a>
            )}
            <br />
            Twitter :{" "}
            {detail.twitter && (
              <a href={detail.twitter} target="_blank" rel="noreferrer">
                Kunjungi Laman
              </a>
            )}
            <br />
            Instagram :{" "}
            {detail.instagram && (
              <a href={detail.instagram} target="_blank" rel="noreferrer">
                Kunjungi Laman
              </a>
            )}
            <br />
            Youtube :{" "}
            {detail.youtube && (
              <a href={detail.youtube} target="_blank" rel="noreferrer">
                Kunjungi Laman
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const Lokasi = () => {
  const [data, setData] = useState([]);
  const [curData, setCurData] = useState([]);
  const [detail, setDetail] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [map, setMap] = useState();
  const dataRef = useRef(null);
  const mapRef = useRef(null);

  const handleResize = () => {
    if (window.innerWidth < 1200) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    axios
      .get(`/api/public/dataBawaslu`)
      .then((res) => {
        setData(() => res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!data) return;
    const items = data.filter((item) => {
      if (filter === "") {
        return item;
      } else if (item.nama_bawaslu?.toLowerCase().includes(filter)) {
        return item;
      }
    });
    if (filter === "") setDetail(data[0]);
    setCurData(items);
  }, [filter, data]);

  return (
    <>
      <div id="lokasi-popup">
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-location-arrow fa-2x" />
              <br />
              <span className="point">Daftar</span> Bawaslu Se-Indonesia
            </h2>
            <p>
              Berikut merupakan data-data dan lokasi Bawaslu RI, Bawaslu
              Provinsi maupun Bawaslu Kabupaten/Kota Se-Indonesia
            </p>
          </div>
          {/* .item-title */}
          <button
            className="scroll-chevron"
            onClick={() => {
              dataRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <i className="fa fa-chevron-down fa-2x" />
          </button>
        </div>
        <div className="info-item" ref={dataRef}>
          <div className="locate-block">
            <div
              className="col-xs-12 col-lg-7 place-info"
              style={{ marginBottom: "2em" }}
            >
              <img
                alt=""
                className="img-responsive logo-lokasi"
                src="/images/icon.png"
              />
              <h3>
                <span className="point">Bawaslu</span> Republik Indonesia
                <br />
                <small>
                  Jl. M.H. Thamrin No.14, Gondangdia, Kec. Menteng, Kota Jakarta
                  Pusat, Daerah Khusus Ibukota Jakarta 10240
                </small>
              </h3>
              <p>
                Berikut merupakan data Bawaslu Republik Indonesia, Bawaslu
                Provinsi dan Bawaslu Kabupaten/Kota Se-Indonesia
              </p>
              <p>
                Klik untuk melihat detail, ketik pada kolom filter untuk
                mencari.
              </p>
              <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                <div className="form-group">
                  <input
                    type="text"
                    id="subject"
                    className="form form-control"
                    onBlur={(e) => (e.target.placeholder = "Bawaslu ...")}
                    onChange={(e) => setFilter(e.target.value.toLowerCase())}
                    name="subject"
                    data-name="Subject"
                  />
                </div>
              </div>
              <span className="border" />
              <PerfectScrollbar>
                <div className="col-md-12 no-padding box-scroll">
                  {data.length === 0 && (
                    <div className="col-xs-12 location-bottom mr-5">
                      <h5>DATA TIDAK DITEMUKAN</h5>
                    </div>
                  )}
                  {curData &&
                    curData.length !== 0 &&
                    curData.map((item, idk) => (
                      <div
                        role="button"
                        className="col-xs-12 col-sm-5 col-lg-5 location-bottom mr-5"
                        key={idk}
                        onClick={() => {
                          setDetail(item);
                          if (isMobile) setOpen(true);
                        }}
                      >
                        <h5>
                          <i className="fa fa-university" /> {item.nama_bawaslu}
                        </h5>
                        <p className="color-info">
                          {item.alamat_bawaslu}
                          <br />
                          {item.telp_bawaslu}
                        </p>
                      </div>
                    ))}
                </div>
              </PerfectScrollbar>
            </div>
            {/* detail */}
            {detail && Object.keys(detail).length !== 0 && (
              <div className={isMobile ? "hidden" : "" + "col-lg-5 no-padding"}>
                <>
                  <div id="map" ref={mapRef}>
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_MAPS }}
                      defaultCenter={{
                        lat: 59.95,
                        lng: 30.33,
                      }}
                      defaultZoom={11}
                    >
                      <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text="Bawaslu Republik Indonesia"
                      />
                    </GoogleMapReact>
                  </div>
                </>
                <div className="clear" />
                <DetailBox detail={detail} />

                <Dialog
                  PaperProps={{
                    style: {
                      backgroundColor: "#0F0F19",
                      boxShadow: "none",
                    },
                  }}
                  fullWidth={true}
                  maxWidth="lg"
                  open={open}
                  onClose={() => setOpen(false)}
                >
                  <DialogContent>
                    <DetailBox detail={detail} modal={true} />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => setOpen(false)}
                      style={{ fontSize: 14 }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
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
          {/* .locate-block */}
        </div>
      </div>
    </>
  );
};

Lokasi.public = true;
export default Lokasi;
