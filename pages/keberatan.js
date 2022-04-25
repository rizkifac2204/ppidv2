import React from "react";

function Keberatan() {
  return (
    <>
      <>
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
          <button className="scroll-chevron">
            <i className="fa fa-chevron-down fa-2x" />
          </button>
        </div>
        <div className="info-item">
          <div className="first-block">
            <div className="container container-wide spec-sm">
              <div className="col-md-12">
                <h2>
                  <small>
                    Formulir Cek Permohonan Informasi <br />
                    <small>Isi Data Dengan Lengkap</small>
                  </small>
                </h2>
              </div>
            </div>
          </div>
          {/* .first-block */}
          <div className="contact-block">
            <div className="col-xs-12 col-sm-12 col-lg-5 info-solutions">
              <h3>
                <span className="point">
                  <i className="fa fa-bookmark" />
                </span>
                Contact Informations
                <br />
                <small>Postal, E-mail, Phone, FAX.</small>
              </h3>
              <p className="contact-p">
                Opening Hours : 9.00 - 18.00
                <br />
                Monday <i className="fa fa-arrow-right" /> Saturday
              </p>
              <span className="border-light" />
              <div className="col-xs-12 col-sm-12 col-lg-12 contact-solution no-padding">
                <h4>
                  <i className="fa fa-envelope-o" /> Postal Address
                </h4>
                <p>
                  PO Box 16122 Collins Street West
                  <br />
                  Victoria 8007 Australia
                </p>
              </div>
              <div className="col-xs-12 col-sm-12 col-lg-12 contact-solution no-padding">
                <h4>
                  <i className="fa fa-paper-plane-o" /> E-mail
                </h4>
                <p>
                  Merchandising :
                  <a href="mailto:info@wwww.com">info@wwww.com</a>
                  <br />
                  Webmaster : <a href="mailto:web@wwww.com">web@wwww.com</a>
                </p>
              </div>
              <div className="col-xs-12 col-sm-12 col-lg-12 contact-solution no-padding">
                <h4>
                  <i className="fa fa-phone" /> Phone
                </h4>
                <p>
                  Customer : <a href="tel:+3354737263">+33 (00) 547 372 63</a>
                  <br />
                  Profesional :<a href="tel:+6678764543">+66 (87) 7876 4543</a>
                </p>
              </div>
              <div className="col-xs-12 col-sm-12 col-lg-12 contact-solution no-padding">
                <h4>
                  <i className="fa fa-keyboard-o" /> FAX
                </h4>
                <p>Main Line : 0-987-998-675</p>
              </div>
            </div>
            {/* .info-solutions */}
            <div className="col-xs-12 col-sm-12 col-lg-7 contact-part">
              <h3>
                <span className="point-gold">
                  <i className="fa fa-bookmark" />
                </span>
                Say Hello!
                <br />
                <small>Response in less than 24Hrs.</small>
              </h3>
              <p className="contact-p-right">
                If you want to collaborate on crafting amazing experience for
                people, you are very welcome to contact our group. We are
                available for freelance projects and full-time employment.
                <br />
                Just use the form below!
              </p>
              {/* Contact form */}
              <form
                id="contact-form"
                name="contact-form"
                method="POST"
                data-name="Contact Form"
              >
                {/* Full name */}
                <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                  <div className="form-group">
                    <input
                      type="text"
                      id="name"
                      className="form form-control"
                      placeholder="Write your name"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) => (e.target.placeholder = "Write your name")}
                      name="name"
                      data-name="Name"
                      required
                    />
                  </div>
                </div>
                {/* E-mail */}
                <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                  <div className="form-group">
                    <input
                      type="email"
                      id="email"
                      className="form form-control"
                      placeholder="Write your email address"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) =>
                        (e.target.placeholder = "Write your email address")
                      }
                      name="email-address"
                      data-name="Email Address"
                      required
                    />
                  </div>
                </div>
                {/* Subject */}
                <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                  <div className="form-group">
                    <input
                      type="text"
                      id="subject"
                      className="form form-control"
                      placeholder="Write the subject"
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) =>
                        (e.target.placeholder = "Write the subject")
                      }
                      name="subject"
                      data-name="Subject"
                    />
                  </div>
                </div>
                {/* Message */}
                <div className="col-xs-12 col-sm-12 col-lg-12 no-padding">
                  <div className="form-group">
                    <textarea
                      id="text-area"
                      className="form textarea form-control"
                      placeholder="Your message here... 20 characters Min."
                      onFocus={(e) => (e.target.placeholder = "")}
                      onBlur={(e) =>
                        (e.target.placeholder =
                          "Your message here... 20 characters Min.")
                      }
                      name="message"
                      data-name="Text Area"
                      required
                      defaultValue={""}
                    />
                  </div>
                </div>
                {/* Button submit */}
                <button type="submit" id="valid-form" className="btn btn-large">
                  Send my Message
                </button>
              </form>
              {/* /. Contact form */}
              <div id="answer" />
            </div>
            {/* .contact-part */}
            <div className="clear" />
          </div>
          {/* .contact-block */}
        </div>
      </>
    </>
  );
}

Keberatan.public = true;
export default Keberatan;
