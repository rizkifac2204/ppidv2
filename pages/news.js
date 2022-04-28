const News = () => {
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
            <div className="container">
              <div className="col-md-12">
                <h2>We are Coming Soon.</h2>
              </div>
            </div>
          </div>
          {/* .first-block */}
          <div className="container countdown-block">
            <div className="col-md-4">
              <h3>
                <span className="point">
                  <i className="fa fa-clock-o" />
                </span>
                Launching Informations
                <br />
                <small>December 14th, 2018</small>
              </h3>
              <h4>
                <i className="fa fa-bullhorn" /> Meet us during this event.
              </h4>
              <p className="countdown-p">
                If you want to collaborate on crafting amazing experience for
                people – you are very welcome to join us.
              </p>
            </div>
            <div className="col-md-8">
              <div id="countdown_dashboard">
                {/* Days / if you need only 2 figures for the day, delete the first line <div class="digit">0</div> */}
                <div className="col-xs-6 col-sm-3 col-lg-3 dash-glob">
                  <div className="dash days_dash">
                    <div className="digit">0</div>
                    <div className="digit">0</div>
                    <div className="digit">0</div>
                    <span className="dash_title">Days</span>
                  </div>
                </div>
                {/* Hours */}
                <div className="col-xs-6 col-sm-3 col-lg-3 dash-glob">
                  <div className="dash hours_dash">
                    <div className="digit">0</div>
                    <div className="digit">0</div>
                    <span className="dash_title">Hours</span>
                  </div>
                </div>
                {/* Minutes */}
                <div className="col-xs-6 col-sm-3 col-lg-3 dash-glob">
                  <div className="dash minutes_dash">
                    <div className="digit">0</div>
                    <div className="digit">0</div>
                    <span className="dash_title">Minutes</span>
                  </div>
                </div>
                {/* Seconds */}
                <div className="col-xs-6 col-sm-3 col-lg-3 dash-glob">
                  <div className="dash seconds_dash">
                    <div className="digit">0</div>
                    <div className="digit">0</div>
                    <span className="dash_title">Seconds</span>
                  </div>
                </div>
              </div>
              {/* .countdown_dashboard */}
            </div>
          </div>
          {/* .countdown-block */}
          <div className="newsletter-block">
            <div className="col-xs-12 col-sm-12 col-lg-5 block-left-newsletter">
              <i className="fa fa-bell" />
            </div>
            {/* .block-left-newsletter */}
            <div className="col-xs-12 col-sm-12 col-lg-7 block-right-newsletter">
              <div id="subscribe">
                <h2>Be alert!*</h2>
                <p>
                  Subscribe to receive new ideas, inspiration and our weekly
                  news!
                </p>
                <p>
                  Dont miss your chance, <strong>Subscribe now!</strong>
                </p>
                <form action="php/notify-me.php" id="notifyMe" method="POST">
                  <div className="form-group">
                    <div className="controls">
                      <input
                        type="text"
                        id="mail-sub"
                        name="email"
                        placeholder="Write your email and stay tuned!"
                        className="form-control email srequiredField"
                      />
                      <button className="btn btn-lg submit">Subscribe</button>
                      <div className="clear" />
                    </div>
                  </div>
                </form>
              </div>
              {/* .subscribe */}
            </div>
            {/* .block-right-newsletter */}
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
          {/* .newsletter-block */}
        </div>
      </div>
    </>
  );
};

News.public = true;
export default News;
