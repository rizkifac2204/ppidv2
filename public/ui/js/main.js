/* * OPAL - Exclusive Coming Soon Template
 *
 * This is a premium product available exclusively at this address http://themeforest.net/user/madeon08/portfolio
 *
 * The demo files are minified/crypted for copyright reasons, you will find them, expanded, commented and coded accurately in your download pack.
 *
 * Thanks for your support!
 *
 * */
$(window).load(function () {
  "use strict";
  setTimeout(function () {
    $("#loading")
      .addClass("animated-middle slideOutUp")
      .removeClass("opacity-0");
  }, 1e3),
    setTimeout(function () {
      $("#home").addClass("animated-middle fadeInUp").removeClass("opacity-0");
    }, 800),
    setTimeout(function () {
      setTimeout(function () {
        $(".text-intro").each(function (e) {
          !(function (t) {
            setTimeout(function () {
              $(t)
                .addClass("animated-middle fadeInUp")
                .removeClass("opacity-0");
            }, 150 * e + 150);
          })(this);
        });
      }, 0);
    }, 1e3),
    setTimeout(function () {
      $("#home").removeClass("animated-middle fadeInUp");
    }, 2001);
}),
  (equalheight = function (e) {
    var t = 0,
      i = 0,
      o = new Array(),
      n,
      r = 0;
    $(e).each(function () {
      if (
        ((n = $(this)),
        $(n).height("auto"),
        (topPostion = n.position().top),
        i != topPostion)
      ) {
        for (currentDiv = 0; currentDiv < o.length; currentDiv++)
          o[currentDiv].height(t);
        (o.length = 0), (i = topPostion), (t = n.height()), o.push(n);
      } else o.push(n), (t = t < n.height() ? n.height() : t);
      for (currentDiv = 0; currentDiv < o.length; currentDiv++)
        o[currentDiv].height(t);
    });
  }),
  $(window).load(function () {
    equalheight(".equalizer");
  }),
  $(window).resize(function () {
    equalheight(".equalizer");
  }),
  $(document).ready(function () {
    "use strict";
    function e() {
      t
        ? ($("body").addClass("scroll-touch"),
          $("a#open-more-info").on("click", function () {
            event.preventDefault();
            var e = "#" + this.getAttribute("data-target");
            $("html, body").animate({ scrollTop: $(e).offset().top }, 500);
          }))
        : $("body").mCustomScrollbar({ scrollInertia: 150, axis: "y" });
    }
    $("a#open-more-info").on("click", function () {
      $(".layer-left").toggleClass("hide-layer-left"),
        $("#home").toggleClass("minimize-left"),
        $("#right-side").toggleClass("hide-right"),
        $(".border-right-side").toggleClass("hide-border"),
        $("#close-more-info").toggleClass("hide-close"),
        $(".mCSB_scrollTools").toggleClass("mCSB_scrollTools-left"),
        setTimeout(function () {
          $("#mcs_container").mCustomScrollbar("scrollTo", "#right-side", {
            scrollInertia: 500,
            callbacks: !1,
          });
        }, 350);
    }),
      $(".close-right-part").on("click", function () {
        $(".layer-left").addClass("hide-layer-left"),
          $("#right-side").addClass("hide-right"),
          $("#home").removeClass("minimize-left"),
          $(".border-right-side").addClass("hide-border"),
          $("#close-more-info").addClass("hide-close"),
          $(".mCSB_scrollTools").removeClass("mCSB_scrollTools-left"),
          setTimeout(function () {
            $("#mcs_container").mCustomScrollbar("scrollTo", "#right-side", {
              scrollInertia: 500,
              callbacks: !1,
            });
          }, 350);
      }),
      $(function () {
        $("body").bind("mousewheel", function (e) {
          e.preventDefault();
          var t = this.scrollTop;
          this.scrollTop = t + e.deltaY * e.deltaFactor * -1;
        });
      });
    var t = navigator.userAgent.match(
      /(iPhone|iPod|iPad|Android|BlackBerry|Windows Phone)/
    );
    e(),
      window.matchMedia("(min-width: 1025px)").matches &&
        $(function () {
          $("[data-toggle='tooltip']").tooltip();
        }),
      $("#notifyMe").notifyMe(),
      (function () {
        var e = document.querySelector("[data-dialog]"),
          t = document.getElementById(e.getAttribute("data-dialog")),
          i = new DialogFx(t);
        e.addEventListener("click", i.toggle.bind(i));
      })();
    var i = function (e) {
      for (
        var t = function (e) {
            for (
              var t = e.childNodes, i = t.length, o = [], n, r, l, a, s = 0;
              i > s;
              s++
            )
              (n = t[s]),
                1 === n.nodeType &&
                  ((r = n.children[0]),
                  (l = r.getAttribute("data-size").split("x")),
                  (a = {
                    src: r.getAttribute("href"),
                    w: parseInt(l[0], 10),
                    h: parseInt(l[1], 10),
                  }),
                  n.children.length > 1 && (a.title = n.children[1].innerHTML),
                  r.children.length > 0 &&
                    (a.msrc = r.children[0].getAttribute("src")),
                  (a.el = n),
                  o.push(a));
            return o;
          },
          i = function c(e, t) {
            return e && (t(e) ? e : c(e.parentNode, t));
          },
          o = function (e) {
            (e = e || window.event),
              e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
            var t = e.target || e.srcElement,
              o = i(t, function (e) {
                return e.tagName && "FIGURE" === e.tagName.toUpperCase();
              });
            if (o) {
              for (
                var n = o.parentNode,
                  l = o.parentNode.childNodes,
                  a = l.length,
                  s = 0,
                  d,
                  c = 0;
                a > c;
                c++
              )
                if (1 === l[c].nodeType) {
                  if (l[c] === o) {
                    d = s;
                    break;
                  }
                  s++;
                }
              return d >= 0 && r(d, n), !1;
            }
          },
          n = function () {
            var e = window.location.hash.substring(1),
              t = {};
            if (e.length < 5) return t;
            for (var i = e.split("&"), o = 0; o < i.length; o++)
              if (i[o]) {
                var n = i[o].split("=");
                n.length < 2 || (t[n[0]] = n[1]);
              }
            return t.gid && (t.gid = parseInt(t.gid, 10)), t;
          },
          r = function (e, i, o, n) {
            var r = document.querySelectorAll(".pswp")[0],
              l,
              a,
              s;
            if (
              ((s = t(i)),
              (a = {
                galleryUID: i.getAttribute("data-pswp-uid"),
                getThumbBoundsFn: function (e) {
                  var t = s[e].el.getElementsByTagName("img")[0],
                    i =
                      window.pageYOffset || document.documentElement.scrollTop,
                    o = t.getBoundingClientRect();
                  return { x: o.left, y: o.top + i, w: o.width };
                },
              }),
              n)
            )
              if (a.galleryPIDs) {
                for (var d = 0; d < s.length; d++)
                  if (s[d].pid === e) {
                    a.index = d;
                    break;
                  }
              } else a.index = parseInt(e, 10) - 1;
            else a.index = parseInt(e, 10);
            isNaN(a.index) ||
              (o && (a.showAnimationDuration = 0),
              (l = new PhotoSwipe(r, PhotoSwipeUI_Default, s, a)),
              l.init());
          },
          l = document.querySelectorAll(e),
          a = 0,
          s = l.length;
        s > a;
        a++
      )
        l[a].setAttribute("data-pswp-uid", a + 1), (l[a].onclick = o);
      var d = n();
      d.pid && d.gid && r(d.pid, l[d.gid - 1], !0, !0);
    };
    i(".my-gallery");
  });
