const Dip = () => {
  return (
    <>
      <div id="dip-popup">
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-list-ul fa-4x" />
              <br />
              <span className="point">.D</span>IP
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
                <h2>About Us.</h2>
                <h3>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </h3>
              </div>
            </div>
          </div>
          {/* .first-block */}
          <div className="container info-block">
            <div className="col-xs-12 col-sm-12 col-lg-8">
              <h3>
                <span className="point">W&amp;W</span> Corporate USA
                <br />
                <small>Since 1937</small>
              </h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                <br />
                Minima, quod dicta aliquid nemo repellendus distinctio minus
                dolor aperiam suscipit, ea enim accusantium, deleniti qui sequi
                sint nihil modi amet eligendi, quidem animi error labore
                voluptatibus sed. Once upon a time...
                <br />
                Qui magnam labore, iusto nostrum. Praesentium non, impedit
                accusantium consequatur officia architecto, mollitia placeat
                aperiam tenetur pariatur voluptatibus corrupti vitae deserunt!
                <br />
                <br />
                Nostrum non mollitia deserunt ipsam. Sunt quaerat natus
                cupiditate iure ipsa voluptatibus recusandae ratione vitae amet
                distinctio, voluptas, minus vero expedita ea fugit similique sit
                cumque ad id facere?
                <br />
                Ab quas, odio neque quis ratione. Natus labore sit esse.
                <br />
                <br />
                Thank to have read this part of our fabulous adventure, the best
                is coming!
              </p>
            </div>
            <div className="col-xs-12 col-sm-12 col-lg-4">
              <img
                alt=""
                className="img-responsive img-right-about"
                src="img/about-picture.jpg"
              />
              <p className="on-right">
                Fantastic Story, 1937.
                <br />
                We are back.
              </p>
            </div>
          </div>
          {/* .info-block */}
          <div className="second-block">
            <div className="container">
              <div className="col-md-12">
                <h2>Our Services.</h2>
                <h3>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </h3>
              </div>
            </div>
          </div>
          {/* .second-block */}
          <div className="container block-services">
            <div className="col-xs-12 col-sm-4 col-lg-4">
              <div className="item-service">
                <i className="fa fa-diamond" />
                <h4>Well documented</h4>
                <span className="border-service" />
                <p>
                  Lorem ipsum Duis elit nostrud
                  <br />
                  adipisicing adipisicing ea non dolore in nisi ut aliquip do
                  quis sint. Qui magnam labore...
                </p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-4 col-lg-4">
              <div className="item-service">
                <i className="fa fa-pencil" />
                <h4>SEO Ready</h4>
                <span className="border-service" />
                <p>
                  Lorem ipsum Duis elit nostrud
                  <br />
                  adipisicing adipisicing ea non dolore in nisi ut aliquip do
                  quis sint. Qui magnam labore...
                </p>
              </div>
            </div>
            <div className="col-xs-12 col-sm-4 col-lg-4">
              <div className="item-service">
                <i className="fa fa-paper-plane-o" />
                <h4>Easy to use</h4>
                <span className="border-service" />
                <p>
                  Lorem ipsum Duis elit nostrud
                  <br />
                  adipisicing adipisicing ea non dolore in nisi ut aliquip do
                  quis sint. Qui magnam labore...
                </p>
              </div>
            </div>
          </div>
          {/* .block-services */}
          <div className="copyright col-md-12">
            <div className="text-center">
              <p>
                Theme by Madeon08
                <br />© 2015 | All Rights Reserved
              </p>
            </div>
          </div>
          {/* .copyright */}
        </div>
      </div>
    </>
  );
};

Dip.public = true;
export default Dip;
