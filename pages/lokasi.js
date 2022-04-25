const Lokasi = () => {
  return (
    <>
      <div id="lokasi-popup">
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-location-arrow fa-2x" />
              <br />
              <span className="point">Daftar</span> Alamat Bawaslu Se-Indonesia
            </h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          {/* .item-title */}
          <button className="scroll-chevron">
            <i className="fa fa-chevron-down fa-2x" />
          </button>
        </div>
        <div className="info-item">
          <div className="first-block">
            <div className="container container-wide">
              <div className="col-md-12">
                <h2>Locate Us.</h2>
                <h3>
                  PO Box 16122 Collins Street West - Victoria 8007 Australia
                </h3>
              </div>
            </div>
          </div>
          {/* .first-block */}
          <div className="locate-block">
            <div className="col-xs-12 col-sm-12 col-lg-6 place-info">
              <img
                alt=""
                className="img-responsive logo-lokasi"
                src="img/logo-demo.jpg"
              />
              <h3>
                <span className="point">W&amp;W</span> Headquarters
                <br />
                <small>Altitude: 335 meters</small>
              </h3>
              <p>
                Lorem ipsum Duis elit nostrud, adipisicing adipisicing ea non
                dolore in nisi ut aliquip do quis sint. Qui magnam labore...
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex.
              </p>
              <span className="border" />
              <div className="col-md-12 no-padding">
                <div className="col-xs-12 col-sm-12 col-lg-5 location-bottom">
                  <h5>
                    <i className="fa fa-plane" /> Airport office SAS
                  </h5>
                  <p className="color-info">
                    Bondi Beach / Melbourne St
                    <br />
                    South Brisbane QLD 4101
                  </p>
                </div>
                <div className="col-xs-12 col-xs-push-0 col-sm-12 col-sm-push-0 col-lg-5 col-lg-push-1 location-bottom">
                  <h5>
                    <i className="fa fa-bed" /> La Clé des Champs
                  </h5>
                  <p className="color-info">
                    Plage Ouest / Rue de Mantoue
                    <br />
                    Centre-ville de Reims, 51100
                  </p>
                </div>
              </div>
              <div className="col-md-12 no-padding">
                <div className="col-xs-12 col-sm-12 col-lg-5 location-bottom">
                  <h5>
                    <i className="fa fa-university" /> HWS Bank
                  </h5>
                  <p className="color-info">
                    Bockenheimer Landstraße 2-4
                    <br />
                    D-60306 Frankfurt am Main
                  </p>
                </div>
                <div className="col-xs-12 col-xs-push-0 col-sm-12 col-sm-push-0 col-lg-5 col-lg-push-1 location-bottom">
                  <h5>
                    <i className="fa fa-car" /> Western Garage
                  </h5>
                  <p className="color-info">
                    6605 NW 7th St
                    <br />
                    Miami, FL 33126, United States
                  </p>
                </div>
              </div>
              <div className="col-md-12 no-padding">
                <div className="col-xs-12 col-sm-12 col-lg-5 location-bottom">
                  <h5>
                    <i className="fa fa-subway" /> 新宿御苑
                  </h5>
                  <p className="color-info">
                    11 Naitomachi
                    <br />
                    Shinjuku, Tokyo 160-0014
                  </p>
                </div>
              </div>
            </div>
            {/* .place-info */}
            <div className="col-xs-12 col-sm-12 col-lg-6 no-padding">
              {/* <div id="map" /> */}
            </div>
            <div className="clear" />
          </div>
          {/* .locate-block */}
        </div>
      </div>
    </>
  );
};

Lokasi.public = true;
export default Lokasi;
