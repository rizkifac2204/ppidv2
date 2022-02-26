// CUSTOM
$(document).ready(function () {
  "use strict";
  $("#isilagi").on("click", function () {
    setTimeout(function () {
      $("#mcs_container").mCustomScrollbar("scrollTo", "#right-side", {
        scrollInertia: 500,
        callbacks: !1,
      });
    }, 350);
  });
});
