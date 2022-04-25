import { useEffect } from "react";
import PublicTemplate from "./PublicTemplate";

function loadScripts(array, callback) {
  var loader = function (src, handler) {
    var script = document.createElement("script");
    script.src = src;
    if (src === "uis/js/jquery-2.1.3.min.js") {
      script.defer = "defer";
    }
    script.onload = script.onreadystatechange = function () {
      script.onreadystatechange = script.onload = null;
      handler();
    };
    var head = document.getElementsByTagName("head")[0];
    (head || document.body).appendChild(script);
  };
  (function run() {
    if (array.length != 0) {
      loader(array.shift(), run);
    } else {
      callback && callback();
    }
  })();
}

export default function PublicLayout({ children }) {
  useEffect(() => {
    loadScripts(
      ["uis/js/modernizr.js", "uis/js/jquery-2.1.3.min.js"],
      function () {
        const script = document.createElement("script");
        script.src = "uis/js/bootstrap.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
        console.log("All things are loaded");
      }
    );
  }, []);
  return (
    <>
      <PublicTemplate>{children}</PublicTemplate>

      <style jsx global>
        {`
          @import url(uis/css/bootstrap.min.css);
          @import url(uis/font-awesome-4.3.0/css/font-awesome.min.css);
          @import url(uis/css/magnific-popup.css);
          @import url(uis/css/animate.css);
          @import url(uis/css/style-1.css);
        `}
      </style>
    </>
  );
}
