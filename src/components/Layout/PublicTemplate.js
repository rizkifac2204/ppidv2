import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import $ from "jquery";
// MUI
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref) {
  props.timeout.enter = 0;
  props.timeout.exit = 600;
  return <Slide direction="up" ref={ref} {...props} />;
});

const formulirPage = ["/", "/cek", "/survey", "/keberatan"];

function initPgae() {
  setTimeout(function () {
    $(".item-list").each(function (i) {
      (function (self) {
        setTimeout(function () {
          $(self).addClass("show-ready");
        }, i * 150 + 150);
      })(this);
    });
  }, 250);
  setTimeout(function () {
    $(".overlay-prevent").removeClass("").addClass("display-none");
  }, 600);
}
function openPage() {
  $("#nav-item")
    .removeClass("fadeOutUp opacity-0")
    .addClass("fadeInDown index9999");
  $(".list-sections").removeClass("").addClass("fadeOutDown");
  setTimeout(function () {
    $(".item-list").removeClass("show-ready").addClass("");
  }, 800);
}
function closePage() {
  $("#nav-item").removeClass("fadeInDown").addClass("fadeOutUp");
  setTimeout(function () {
    $("#nav-item").removeClass("index9999").addClass("");
    $(".list-sections").removeClass("fadeOutDown").addClass("");
    $(".item-list").each(function (i) {
      (function (self) {
        setTimeout(function () {
          $(self).addClass("show-ready");
        }, i * 150 + 150);
      })(this);
    });
  }, 100);
}

const Template = ({ children }) => {
  const router = useRouter();
  const [first, setFirst] = useState(true);
  const [open, setOpen] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [currentFormulir, setCurrentFormulir] = useState({
    currentUrl: "/",
    head: "Permohonan",
    foot: "Pengajuan Permohoan Informasi",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    initPgae();
  }, []);

  useEffect(() => {
    open ? openPage() : closePage();
  }, [open]);

  function allReady(open) {
    setTimeout(() => {
      if (open) setOpen(() => true);
      setFirst(false);
      setPageReady(() => true);
      $("#loading-popup").fadeOut(3000);
    }, 1000);
  }

  useEffect(() => {
    if (!router.isReady) return;
    // fisrt bite / first window load
    if (router.pathname !== "/" && first) allReady(true);
    // router change
    router.events.on("routeChangeStart", () => setPageReady(() => false));
    router.events.on("routeChangeComplete", () => allReady());
    router.events.on("routeChangeError", () => allReady());

    // setting text dan link untuk formulir section
    if (router.pathname === "/")
      setCurrentFormulir({
        currentUrl: router.asPath,
        head: "Permohonan Informasi",
        foot: "Buka Formulir Permohoan Informasi",
      });
    if (router.pathname === "/cek")
      setCurrentFormulir({
        currentUrl: router.asPath,
        head: "Cek Permohonan Informasi",
        foot: "Buka Formulir Permohoan Informasi",
      });
    if (router.pathname === "/keberatan")
      setCurrentFormulir({
        currentUrl: router.asPath,
        head: "Pengajuan Keberatan",
        foot: "Buka Formulir Pengajuan Keberatan",
      });
    if (router.pathname === "/survey")
      setCurrentFormulir({
        currentUrl: router.asPath,
        head: "Survey Layanan",
        foot: "Buka Formulir Survey Layanan",
      });

    return () => setFirst(false);
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div>
        <div className="overlay-prevent" />

        <div className="list-sections animated-middle">
          <ul>
            <li className="item-list">
              <Link href={currentFormulir.currentUrl}>
                <a className="open-popup-link" onClick={handleClickOpen}>
                  <div className="item-title">
                    <h2>
                      <i className="fa fa-file-text" />
                      <br />
                      <span className="point">.F</span>ormulir
                    </h2>
                    <p>{currentFormulir.head}</p>
                  </div>
                  <div className="item-plus">
                    <p>{currentFormulir.foot}</p>
                    <br />
                    <i className="fa fa-plus-circle fa-2x" />
                  </div>
                </a>
              </Link>
            </li>
            <li className="item-list">
              <Link href="/dip">
                <a className="open-popup-link" onClick={handleClickOpen}>
                  <div className="item-title">
                    <h2>
                      <i className="fa fa-list-ul" />
                      <br />
                      <span className="point">.D</span>IP
                    </h2>
                    <p>Daftar Informasi Publik</p>
                  </div>
                  <div className="item-plus">
                    <p>Cari Data Disini</p>
                    <br />
                    <i className="fa fa-plus-circle fa-2x" />
                  </div>
                </a>
              </Link>
            </li>
            <li className="item-list">
              <Link href="/news">
                <a className="open-popup-link" onClick={handleClickOpen}>
                  <div className="item-title">
                    <h2>
                      <i className="fa fa-newspaper-o" />
                      <br />
                      <span className="point">.N</span>ews!
                    </h2>
                    <p>Berlangganan Kabar Berita</p>
                  </div>
                  <div className="item-plus">
                    <p>Update Kabar Terbaru</p>
                    <br />
                    <i className="fa fa-plus-circle fa-2x" />
                  </div>
                </a>
              </Link>
            </li>
            <li className="item-list">
              <Link href="/lokasi">
                <a className="open-popup-link" onClick={handleClickOpen}>
                  <div className="item-title">
                    <h2>
                      <i className="fa fa-location-arrow" />
                      <br />
                      <span className="point">.L</span>okasi
                    </h2>
                    <p>Bawaslu Se-Indonesia</p>
                  </div>
                  <div className="item-plus">
                    <p>ADaftar lamat Bawaslu Se-Indonesia</p>
                    <br />
                    <i className="fa fa-plus-circle fa-2x" />
                  </div>
                </a>
              </Link>
            </li>
          </ul>
        </div>

        <nav id="nav-item" className="animated-middle opacity-0">
          <button type="button" className="mfp-close" onClick={handleClose}>
            <i className="fa fa-bars fa-2x" />
          </button>
          {formulirPage.includes(router.pathname) && (
            <div className="social-icons">
              <Link href="/">
                <a
                  style={
                    currentFormulir.currentUrl === "/"
                      ? { color: "#2b2d35", background: "#ffffff" }
                      : {}
                  }
                >
                  Permohonan
                </a>
              </Link>
              <Link href="/cek">
                <a
                  style={
                    currentFormulir.currentUrl === "/cek"
                      ? { color: "#2b2d35", background: "#ffffff" }
                      : {}
                  }
                >
                  Cek
                </a>
              </Link>
              <Link href="/keberatan">
                <a
                  style={
                    currentFormulir.currentUrl === "/keberatan"
                      ? { color: "#2b2d35", background: "#ffffff" }
                      : {}
                  }
                >
                  Keberatan
                </a>
              </Link>
              <Link href="/survey">
                <a
                  style={
                    currentFormulir.currentUrl === "/survey"
                      ? { color: "#2b2d35", background: "#ffffff" }
                      : {}
                  }
                >
                  Survey
                </a>
              </Link>
            </div>
          )}
        </nav>
      </div>

      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
        fullScreen
        disableEnforceFocus
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <div id="loading-popup">
          <div className="background-top"></div>
        </div>
        {pageReady && children}
      </Dialog>
    </>
  );
};

export default Template;
