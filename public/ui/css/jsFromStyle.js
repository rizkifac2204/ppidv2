export default async function JsFromStyle() {
  const style = `/*
  * OPAL - Exclusive Coming Soon Template
  * Build Date: April 2016
  * Last Update: July 2016
  * Author: Madeon08
  * Copyright (C) 2016 Madeon08
  * This is a premium product available exclusively here : http://themeforest.net/user/Madeon08/portfolio
  */
  /*  TABLE OF CONTENTS
      ---------------------------
      *. @Import & Reset
      1. Generic styles
      2. Home
      3. More Informations
      4. Newsletter
      5. Contact
      6. Social Icons
      7. Footer/Copyright
      8. Media Queries
  */
  /* ------------------------------------- */
  /* *. @Import & Reset .................. */
  /* ------------------------------------- */
  
  /* custom CSS files */
  @import url(font-awesome.min.css);
  @import url(ionicons.min.css);
  @import url(bootstrap.min.css);
  @import url(animate.css);
  @import url(photoswipe.css);
  @import url(default-skin/default-skin.css);
  @import url(jquery.mCustomScrollbar.css);
  @import url(vegas.css);
  /* Google Fonts */
  @import url("http://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700");
  @import url("https://fonts.googleapis.com/css?family=Raleway:300,400,500,700");
  /*
  * http://meyerweb.com/eric/tools/css/reset/ 
  * v2.0 | 20110126
  * License: none (public domain)
  */
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section,
  main {
    display: block;
  }
  
  body {
    line-height: 1;
  }
  
  ol,
  ul {
    list-style: none;
  }
  
  blockquote,
  q {
    quotes: none;
  }
  
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  /* ------------------------------------- */
  /* Preloader styles .................... */
  /* ------------------------------------- */
  #loading {
    width: 100vw;
    height: 100vh;
    background: #20232d;
    position: fixed;
    z-index: 999;
  }
  #loading #preloader {
    position: relative;
    width: 100%;
    height: 3rem;
    top: calc(50% - 1.5rem);
    text-align: center;
    margin: 0 auto;
  }
  #loading #preloader:after {
    content: "Opal";
    /* Text under the circle */
    position: absolute;
    text-transform: uppercase;
    font-size: 1.2rem;
    font-weight: 700;
    color: #4d515f;
    letter-spacing: 0.2rem;
    top: 3.5rem;
    width: 100%;
    left: 0;
    right: 0;
    height: 1px;
    text-align: center;
  }
  #loading #preloader span {
    position: absolute;
    border: 2px solid #4d515f;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    border-radius: 50%;
  }
  #loading #preloader span:nth-child(1) {
    width: 3rem;
    height: 3rem;
    left: calc(50% - 1.5rem);
    border-bottom: 2px solid #00c8aa;
    z-index: 10;
    -webkit-animation: spin-1 1s infinite ease-in-out;
    -moz-animation: spin-1 1s infinite ease-in-out;
    animation: spin-1 1s infinite ease-in-out;
  }
  #loading #preloader span:nth-child(2) {
    left: calc(50% - 1.5rem);
    width: 3rem;
    height: 3rem;
  }
  
  @-webkit-keyframes spin-1 {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @-moz-keyframes spin-1 {
    0% {
      -moz-transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @keyframes spin-1 {
    0% {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  /* ------------------------------------- */
  /* 1. Generic styles ................... */
  /* ------------------------------------- */
  html {
    font-size: 62.5%;
  }
  
  body {
    background: #20232d;
    font-family: "Open Sans", "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: normal;
    font-style: normal;
    font-size: 1.4rem;
    line-height: 1.8;
    font-weight: 400;
    letter-spacing: 0;
    position: absolute;
    height: 100%;
  }
  
  .scroll-touch {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  body,
  html {
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
  }
  
  body,
  input,
  select,
  textarea {
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  
  a {
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    text-decoration: none;
    color: #ffffff;
  }
  a:hover {
    color: #00af94;
    text-decoration: none !important;
    outline: none !important;
  }
  a:active,
  a:focus {
    outline: none !important;
    text-decoration: none !important;
    color: #ffffff;
  }
  
  button {
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }
  button:hover,
  button:active,
  button:focus {
    outline: none !important;
    text-decoration: none !important;
    color: #2b2d35;
  }
  
  strong,
  b {
    font-weight: 700;
  }
  
  em,
  i {
    font-style: italic;
  }
  
  p {
    font-family: "Open Sans", "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    margin: 0;
    font-size: 1.4rem;
    line-height: 1.8;
    color: #666666;
    font-weight: 400;
  }
  
  p.text-intro {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 3rem;
    line-height: 1.5;
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #ffffff;
    font-family: Raleway, "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    font-weight: 400;
    line-height: 1;
    margin: 0 0 1.5rem 0;
  }
  h1 a,
  h2 a,
  h3 a,
  h4 a,
  h5 a,
  h6 a {
    color: inherit;
    text-decoration: none;
  }
  h1 small,
  h2 small,
  h3 small,
  h4 small,
  h5 small,
  h6 small {
    color: inherit;
  }
  
  h1 {
    font-size: 4.5rem;
  }
  
  h2 {
    font-size: 3.3rem;
  }
  
  h3 {
    font-size: 2.3rem;
  }
  
  h4 {
    font-size: 1.8rem;
  }
  
  h5 {
    font-size: 1.6rem;
  }
  
  h6 {
    font-size: 1.2rem;
  }
  
  sub {
    font-size: 0.8em;
    position: relative;
    top: 0.5em;
  }
  
  sup {
    font-size: 0.8em;
    position: relative;
    top: -0.5em;
  }
  
  .clear {
    clear: both;
  }
  
  .display-none {
    display: none !important;
  }
  
  .align-left {
    text-align: left;
  }
  
  .align-center {
    text-align: center;
  }
  
  .align-right {
    text-align: right;
  }
  
  .no-margin-bottom {
    margin-bottom: 0;
  }
  
  .opacity-0 {
    opacity: 0 !important;
    visibility: hidden !important;
  }
  
  .opacity-03 {
    opacity: 0.3 !important;
  }
  
  .opacity-1 {
    opacity: 1 !important;
    visibility: visible !important;
  }
  
  .index-999 {
    z-index: -999 !important;
  }
  
  /* ------------------------------------- */
  /* 2. Home ............................. */
  /* ------------------------------------- */
  .light-btn {
    font-family: Raleway, "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    background: transparent;
    font-weight: 700;
    padding: 0.7em 2em;
    color: #ffffff;
    margin-right: 10px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #efefef;
    display: block;
    float: left;
  }
  .light-btn:hover {
    background: #ffffff;
    color: #2b2d35;
    border-color: #ffffff;
  }
  
  .action-btn {
    font-family: Raleway, "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    background: #ffffff;
    font-weight: 700;
    padding: 0.7em 2em;
    color: #000000;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    border: 1px solid #ffffff;
    display: block;
    float: left;
  }
  .action-btn:hover {
    background: rgba(45, 49, 56, 0.1);
    color: #ffffff;
    border-color: #ffffff;
  }
  
  #vegas-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100% !important;
    width: 100%;
    z-index: -1;
  }
  
  .global-overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    overflow: visible;
    background: rgba(45, 49, 56, 0.4);
    width: 100%;
    z-index: 0;
  }
  
  .overlay {
    position: fixed;
    overflow: hidden;
    top: 0;
    left: -50%;
    background: rgba(32, 35, 45, 0.8);
    width: 100%;
    height: 100%;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    border-right: 1px solid #15171e;
  }
  .overlay.skew-part {
    -webkit-transform: skew(-25deg, 0deg);
    -moz-transform: skew(-25deg, 0deg);
    -ms-transform: skew(-25deg, 0deg);
    -o-transform: skew(-25deg, 0deg);
    transform: skew(-25deg, 0deg);
  }
  
  .brand-logo {
    position: absolute;
    left: 10%;
    top: 5%;
    max-width: 150px;
  }
  
  .outer-home {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100% !important;
  }
  
  #home {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100% !important;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    transform-origin: middle left;
  }
  #home.minimize-left {
    -webkit-transform: perspective(460px) rotateY(8deg) translateX(-200px)
      scale(0.5);
    -moz-transform: perspective(460px) rotateY(8deg) translateX(-200px) scale(0.5);
    -ms-transform: perspective(460px) rotateY(8deg) translateX(-200px) scale(0.5);
    -o-transform: perspective(460px) rotateY(8deg) translateX(-200px) scale(0.5);
    transform: perspective(460px) rotateY(8deg) translateX(-200px) scale(0.5);
    opacity: 0.4 !important;
  }
  #home .content {
    position: relative;
    z-index: 0;
    left: 0;
    padding: 0;
    top: 50vh;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-height: 111rem;
    padding: 0 10%;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    -webkit-transform: translateY(calc(-50% - 50px));
    -moz-transform: translateY(calc(-50% - 50px));
    -ms-transform: translateY(calc(-50% - 50px));
    -o-transform: translateY(calc(-50% - 50px));
    transform: translateY(calc(-50% - 50px));
    text-align: left;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    opacity: 1;
    visibility: visible;
  }
  #home .content .countdown-variant {
    font-family: "Open Sans", "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
  }
  
  /* ------------------------------------- */
  /* 3. More informations ................ */
  /* ------------------------------------- */
  .border-right-side {
    content: "";
    width: 100px;
    height: 110vh;
    z-index: 10;
    top: 0;
    bottom: 0;
    position: fixed;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    -webkit-transform: skew(-8deg) translateX(calc(40vw - 100px));
    -moz-transform: skew(-8deg) translateX(calc(40vw - 100px));
    -ms-transform: skew(-8deg) translateX(calc(40vw - 100px));
    -o-transform: skew(-8deg) translateX(calc(40vw - 100px));
    transform: skew(-8deg) translateX(calc(40vw - 100px));
  }
  .border-right-side:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 500px;
    height: 100vh;
    background: #ffffff;
  }
  .border-right-side.hide-border {
    -webkit-transform: translate3d(100vw, 0, 0);
    -moz-transform: translate3d(100vw, 0, 0);
    -o-transform: translate3d(100vw, 0, 0);
    -ms-transform: translate3d(100vw, 0, 0);
    transform: translate3d(100vw, 0, 0);
  }
  
  .layer-left {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    z-index: 0;
  }
  .layer-left.hide-layer-left {
    z-index: -1000;
  }
  
  #right-side {
    background: #ffffff;
    position: relative;
    overflow: auto;
    z-index: 10;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    top: 0;
    right: -40vw;
    width: 60vw;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }
  #right-side.hide-right {
    right: -100vw;
  }
  #right-side .content {
    position: relative;
    width: 100%;
    padding: 10rem 8rem 10rem 3rem;
    text-align: left;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    opacity: 1;
    visibility: visible;
  }
  #right-side .content h1,
  #right-side .content h2,
  #right-side .content h3,
  #right-side .content h4,
  #right-side .content h5,
  #right-side .content h6 {
    color: #000000;
  }
  #right-side .content span.separator {
    display: block;
    height: 2px;
    background: #f2f3f7;
    width: 100%;
    margin: 6rem 0;
  }
  #right-side .content .photo-line figure {
    padding: 0;
    margin: 0 15px 3rem;
    width: calc(50% - 30px);
    background: #ffffff;
  }
  #right-side .content .photo-line figure:last-child,
  #right-side .content .photo-line figure:nth-last-child(2) {
    margin-bottom: 0;
  }
  #right-side .content .photo-line figure a.box-picture {
    overflow: hidden;
    width: 100%;
    display: block;
    position: relative;
    border-bottom: 2px solid #00c8aa;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
  }
  #right-side .content .photo-line figure a.box-picture p {
    bottom: 50%;
    line-height: 1;
    height: auto;
    width: 100%;
    text-align: center;
    color: #ffffff;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 1em;
    letter-spacing: 0.4rem;
    left: 0;
    opacity: 0;
    position: absolute;
    -webkit-transform: translateY(50%);
    -moz-transform: translateY(50%);
    -ms-transform: translateY(50%);
    -o-transform: translateY(50%);
    transform: translateY(50%);
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  #right-side .content .photo-line figure a.box-picture:hover {
    background: #000000;
  }
  #right-side .content .photo-line figure a.box-picture:hover img {
    opacity: 0.5;
  }
  #right-side .content .photo-line figure a.box-picture:hover p {
    opacity: 1;
  }
  #right-side .content .photo-line figure img {
    overflow: hidden;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }
  #right-side .content .photo-line figure .photo-details {
    background: #ffffff;
    padding: 1em 1em 1em 0;
    text-align: left;
  }
  #right-side .content .photo-line figure .photo-details h4 {
    font-weight: 300;
    margin-bottom: 0.5rem;
  }
  #right-side .content .photo-line figure .photo-details h5 {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    color: #999;
  }
  #right-side .content .photo-line figure .photo-details span.border {
    display: block;
    height: 2px;
    background: #00c8aa;
    width: 10%;
    margin: 0.8em 0 1em;
  }
  
  .widget-angle-top-right {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    padding: 0;
    color: #00c8aa;
    font-size: 1em;
    border-top: 50px solid #2b2d35;
    border-left: 50px solid transparent;
  }
  .widget-angle-top-right span.icon-text {
    font-weight: 700;
    position: absolute;
    top: -47px;
    left: -22px;
  }
  
  .widget-angle-bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    background: transparent;
    border: none;
    padding: 0;
    color: #00c8aa;
    font-size: 1em;
    border-bottom: 50px solid #2b2d35;
    border-left: 50px solid transparent;
  }
  .widget-angle-bottom-right span.icon-text {
    font-weight: 700;
    position: absolute;
    top: 23px;
    left: -22px;
  }
  
  .widget-angle-bottom-left {
    position: absolute;
    bottom: 0;
    left: 0;
    background: transparent;
    border: none;
    padding: 0;
    color: #00c8aa;
    font-size: 1em;
    border-bottom: 50px solid #2b2d35;
    border-right: 50px solid transparent;
  }
  .widget-angle-bottom-left span.icon-text {
    font-weight: 700;
    position: absolute;
    top: 23px;
    left: 7px;
  }
  
  .widget-angle-top-left {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    border: none;
    padding: 0;
    color: #00c8aa;
    font-size: 1em;
    border-top: 50px solid #2b2d35;
    border-right: 50px solid transparent;
  }
  .widget-angle-top-left span.icon-text {
    font-weight: 700;
    position: absolute;
    top: -47px;
    left: 7px;
  }
  
  #close-more-info {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 20;
    width: 50px;
    height: 50px;
    line-height: 0;
    background: #000000;
    border: none;
    color: #ffffff;
    font-size: 2em;
    -webkit-border-radius: 0 0 0 3px;
    -moz-border-radius: 0 0 0 3px;
    -ms-border-radius: 0 0 0 3px;
    border-radius: 0 0 0 3px;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }
  #close-more-info i {
    display: inline-block;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  #close-more-info:hover i {
    font-size: 3.5rem;
  }
  #close-more-info.hide-close {
    right: -50px;
  }
  
  .mCSB_scrollTools .mCSB_dragger:active .mCSB_dragger_bar,
  .mCSB_scrollTools .mCSB_dragger.mCSB_dragger_onDrag .mCSB_dragger_bar {
    background: #2fffe0;
  }
  
  .mCSB_scrollTools .mCSB_dragger:hover .mCSB_dragger_bar {
    background: #2fffe0;
  }
  
  .mCSB_scrollTools {
    /* Scrollbar */
    position: absolute;
    width: 10px;
    height: calc(100vh + 10px);
    margin-top: -5px;
    left: auto;
    top: 0;
    right: -10px;
    bottom: 0;
    z-index: 10;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }
  .mCSB_scrollTools .mCSB_draggerRail {
    width: 10px;
    height: 100%;
    margin: 0;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    -ms-border-radius: 0;
    border-radius: 0;
    background-color: transparent;
    filter: "alpha(opacity=40)";
    -ms-filter: "alpha(opacity=40)";
  }
  .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
    /* the dragger element */
    position: relative;
    width: 10px;
    height: 100%;
    margin: 0 auto;
    -webkit-border-radius: 40%;
    -moz-border-radius: 40%;
    -ms-border-radius: 40%;
    border-radius: 40%;
    text-align: center;
  }
  .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
    background-color: #00c8aa;
  }
  
  .mCSB_scrollTools-left {
    right: calc(60vw + 88px) !important;
    -webkit-transform: skew(-8deg);
    -moz-transform: skew(-8deg);
    -ms-transform: skew(-8deg);
    -o-transform: skew(-8deg);
    transform: skew(-8deg);
  }
  
  .box-info-light {
    padding: 5rem 3rem;
    border: 1px solid #efefef;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
  }
  .box-info-light span.icon {
    color: #000000;
    font-size: 4rem;
    line-height: 1.4;
    display: inline-block;
    padding: 2px;
  }
  .box-info-light span.icon.icon-clock {
    -webkit-animation: clocky 2s infinite linear;
    -moz-animation: clocky 2s infinite linear;
    animation: clocky 2s infinite linear;
  }
  .box-info-light h3 {
    font-family: "Open Sans", "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    text-transform: uppercase;
  }
  
  .box-info-dark {
    padding: 5rem 3rem;
    border: 1px solid #20232d;
    background: #2b2d35;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
  }
  .box-info-dark span.icon {
    color: #ffffff;
    font-size: 4rem;
    line-height: 1.4;
    display: inline-block;
    padding: 2px;
  }
  .box-info-dark h3 {
    color: #ffffff !important;
    font-family: "Open Sans", "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    text-transform: uppercase;
  }
  .box-info-dark p {
    color: #ffffff;
  }
  
  @-webkit-keyframes clocky {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @-moz-keyframes clocky {
    0% {
      -moz-transform: rotate(0deg);
    }
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @keyframes clocky {
    0% {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  /* ------------------------------------- */
  /* 4. Newsletter ....................... */
  /* ------------------------------------- */
  .dialog,
  .dialog__overlay {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  
  .dialog {
    position: fixed;
    z-index: 999;
    display: -webkit-box;
    display: -moz-box;
    display: box;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    box-pack: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    -ms-justify-content: center;
    -o-justify-content: center;
    justify-content: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    box-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    -ms-align-items: center;
    -o-align-items: center;
    align-items: center;
    -ms-flex-align: center;
    pointer-events: none;
  }
  
  .dialog__overlay {
    position: absolute;
    z-index: 1;
    background: rgba(31, 34, 46, 0.9);
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .dialog--open .dialog__overlay {
    opacity: 1;
    pointer-events: auto;
  }
  
  .dialog__content {
    width: 50%;
    max-width: 500px;
    min-width: 290px;
    background: transparent;
    padding: 0;
    text-align: center;
    position: relative;
    z-index: 5;
    opacity: 0;
    overflow: hidden;
    background: url(../img/background-newsletter.jpg) center;
    background-size: cover;
    border-top: 10px solid #ffffff;
    border-right: 10px solid #ffffff;
    border-bottom: 10px solid #16ffdc;
    border-left: 10px solid #16ffdc;
  }
  .dialog__content::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: rgba(32, 35, 45, 0.8);
  }
  
  .dialog--open .dialog__content {
    pointer-events: auto;
  }
  
  .dialog .close-newsletter {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    background: #000000;
    width: 50px;
    height: 50px;
    line-height: 0;
    color: #ffffff;
    font-size: 2em;
    opacity: 1;
  }
  .dialog .close-newsletter i {
    display: inline-block;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  .dialog .close-newsletter:hover i {
    font-size: 3.5rem;
  }
  .dialog .dialog-inner {
    padding: 90px 70px;
    overflow: hidden;
  }
  .dialog .dialog-inner::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .dialog .dialog-inner h4 {
    color: #ffffff;
    font-size: 4rem;
    font-weight: 700;
  }
  .dialog .dialog-inner p {
    color: #f2f3f7;
    font-size: 16px;
  }
  
  #subscribe p {
    font-weight: 400;
  }
  #subscribe #notifyMe {
    max-width: 450px;
    margin: auto;
    margin-top: 2em;
  }
  #subscribe #notifyMe .form-group {
    margin-bottom: 1em;
  }
  #subscribe #notifyMe .form-group .fa {
    color: #757a86;
    position: absolute;
    text-align: center;
    top: 15px;
    left: 15px;
  }
  #subscribe #notifyMe .form-group .form-control {
    text-align: center;
    background: transparent;
    border: 1px solid #ffffff;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    -ms-border-radius: 0;
    border-radius: 0;
    box-shadow: none;
    height: 50px;
    font-weight: 600;
    outline: medium none;
    padding: 0 1em;
    width: 100%;
    margin: auto;
    color: #ffffff;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  #subscribe #notifyMe .form-group .form-control:hover,
  #subscribe #notifyMe .form-group .form-control:focus {
    box-shadow: none;
  }
  #subscribe #notifyMe .form-group .form-control::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  #subscribe #notifyMe .form-group .form-control::-moz-placeholder {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  #subscribe #notifyMe .form-group .form-control:-moz-placeholder {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  #subscribe #notifyMe .form-group .form-control:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.5) !important;
  }
  #subscribe #notifyMe .form-group button.submit {
    padding: 1.3rem 2.5rem;
    font-size: 1.4rem;
    display: block;
    margin: 2rem auto 0;
    background: #00c8aa;
    color: #ffffff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    font-weight: 600;
    width: auto;
  }
  #subscribe #notifyMe .form-group button.submit:hover {
    background: #00af94;
    color: #ffffff;
  }
  #subscribe .block-message {
    min-height: 50px;
    position: absolute;
    bottom: -100px;
    width: 100%;
    left: 0;
    padding: 15px;
    background: transparent;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  #subscribe .block-message.show-block-error {
    bottom: 0;
    background: #ff1d4d;
  }
  #subscribe .block-message.show-block-valid {
    bottom: 0;
    background: #00c8aa;
  }
  #subscribe p.notify-valid {
    color: #ffffff;
    text-transform: none;
    font-size: 16px;
    letter-spacing: 0;
    font-weight: 600;
  }
  
  .dialog__overlay {
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  
  .dialog.dialog--open .dialog__content,
  .dialog.dialog--close .dialog__content {
    -webkit-animation-duration: 0.4s;
    -moz-animation-duration: 0.4s;
    animation-duration: 0.4s;
    -webkit-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
  }
  
  .dialog.dialog--open .dialog__content {
    -webkit-animation-name: anim-open;
    -moz-animation-name: anim-open;
    animation-name: anim-open;
  }
  
  .dialog.dialog--close .dialog__content {
    -webkit-animation-name: anim-close;
    -moz-animation-name: anim-close;
    animation-name: anim-close;
  }
  
  @-webkit-keyframes anim-open {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, 50px, 0);
      -moz-transform: translate3d(0, 50px, 0);
      -o-transform: translate3d(0, 50px, 0);
      -ms-transform: translate3d(0, 50px, 0);
      transform: translate3d(0, 50px, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @-moz-keyframes anim-open {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, 50px, 0);
      -moz-transform: translate3d(0, 50px, 0);
      -o-transform: translate3d(0, 50px, 0);
      -ms-transform: translate3d(0, 50px, 0);
      transform: translate3d(0, 50px, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes anim-open {
    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, 50px, 0);
      -moz-transform: translate3d(0, 50px, 0);
      -o-transform: translate3d(0, 50px, 0);
      -ms-transform: translate3d(0, 50px, 0);
      transform: translate3d(0, 50px, 0);
    }
    100% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }
  @-webkit-keyframes anim-close {
    0% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    100% {
      opacity: 0;
      -webkit-transform: translate3d(0, 50px, 0);
      -moz-transform: translate3d(0, 50px, 0);
      -o-transform: translate3d(0, 50px, 0);
      -ms-transform: translate3d(0, 50px, 0);
      transform: translate3d(0, 50px, 0);
    }
  }
  @-moz-keyframes anim-close {
    0% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    100% {
      opacity: 0;
      -webkit-transform: translate3d(0, 50px, 0);
      -moz-transform: translate3d(0, 50px, 0);
      -o-transform: translate3d(0, 50px, 0);
      -ms-transform: translate3d(0, 50px, 0);
      transform: translate3d(0, 50px, 0);
    }
  }
  @keyframes anim-close {
    0% {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      -moz-transform: translate3d(0, 0, 0);
      -o-transform: translate3d(0, 0, 0);
      -ms-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
    100% {
      opacity: 0;
      -webkit-transform: translate3d(0, 50px, 0);
      -moz-transform: translate3d(0, 50px, 0);
      -o-transform: translate3d(0, 50px, 0);
      -ms-transform: translate3d(0, 50px, 0);
      transform: translate3d(0, 50px, 0);
    }
  }
  /* ------------------------------------- */
  /* 5. Contact .......................... */
  /* ------------------------------------- */
  .info-contact {
    margin-bottom: 30px;
  }
  .info-contact .item-map {
    padding: 0;
  }
  .info-contact .item-map:first-child {
    padding-left: 15px;
  }
  .info-contact .item-map:last-child {
    padding-right: 15px;
  }
  .info-contact .item-map .contact-item {
    padding: 1rem 0 2rem;
  }
  .info-contact .item-map .contact-item i {
    color: #333333;
    font-size: 2em;
  }
  .info-contact .item-map .contact-item a {
    font-weight: 600;
    color: #666666;
  }
  .info-contact .item-map .contact-item a:hover {
    color: #00c8aa;
  }
  
  .phone-mail-link {
    color: #00c8aa;
    font-weight: bold;
  }
  
  #contact-form {
    margin-top: 40px;
  }
  #contact-form .form-control {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    box-shadow: none;
    font-weight: 400;
    outline: medium none;
    padding: 1.6rem 3rem;
    font-size: 1.4rem;
    line-height: 1.4;
    height: auto;
    width: 100%;
    color: #000000;
    margin-bottom: 2rem;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
    text-align: left;
  }
  #contact-form .form-control:hover,
  #contact-form .form-control:focus {
    box-shadow: none;
    border-color: rgba(0, 0, 0, 0.2);
  }
  #contact-form .form-control::-webkit-input-placeholder {
    color: #666666 !important;
  }
  #contact-form .form-control::-moz-placeholder {
    color: #666666 !important;
  }
  #contact-form .form-control:-moz-placeholder {
    color: #666666 !important;
  }
  #contact-form .form-control:-ms-input-placeholder {
    color: #666666 !important;
  }
  #contact-form textarea.form-control {
    min-height: 150px;
  }
  #contact-form button#valid-form {
    padding: 1.3rem 2.5rem;
    font-size: 1.4rem;
    display: block;
    margin: 0;
    background: #00c8aa;
    color: #ffffff;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    -ms-border-radius: 3px;
    border-radius: 3px;
    font-weight: 600;
    width: auto;
  }
  #contact-form button#valid-form:hover {
    background: #00af94;
    color: #ffffff;
  }
  
  #block-answer {
    min-height: 60px;
    margin-top: 1em;
    text-align: center;
    color: #757a86;
  }
  
  .success-message,
  .error-message {
    color: #757a86;
  }
  .success-message p,
  .error-message p {
    color: #757a86 !important;
  }
  .success-message .ion-checkmark-round,
  .error-message .ion-checkmark-round {
    color: #27ae60;
  }
  
  .error-message .ion-close-round {
    color: #ff1d4d;
  }
  
  /* ------------------------------------- */
  /* 6. Social Icons ..................... */
  /* ------------------------------------- */
  .bottom-home {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .social-icons {
    position: absolute;
    left: 0;
    bottom: 0;
    margin-left: 0;
    margin-bottom: 0;
    display: block;
    z-index: 9;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    -webkit-transition: all 0.7s ease-in-out;
    -moz-transition: all 0.7s ease-in-out;
    -ms-transition: all 0.7s ease-in-out;
    -o-transition: all 0.7s ease-in-out;
    transition: all 0.7s ease-in-out;
  }
  .social-icons i {
    color: rgba(255, 255, 255, 0.7);
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  .social-icons a {
    color: rgba(255, 255, 255, 0.7);
    width: 50px;
    line-height: 50px;
    letter-spacing: 0;
    background: transparent;
    font-size: 1em;
    font-weight: 300;
    height: 50px;
    display: inline-block;
    text-align: center;
    float: left;
    margin-right: 0;
    border: none;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  .social-icons a:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  .social-icons a:hover i {
    color: white;
  }
  
  .copyright {
    position: absolute;
    right: 25px;
    bottom: 0;
    font-family: "Open Sans", "Helvetica Neue", "Lucida Grande", Arial, Verdana,
      sans-serif;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    font-weight: 300;
    line-height: 50px;
  }
  
  /* ------------------------------------- */
  /* 7. Footer/Copyright ................. */
  /* ------------------------------------- */
  footer {
    padding: 10px 0;
    background: transparent;
    text-align: center;
  }
  footer p {
    font-size: 11px;
    font-weight: 100;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #757a86;
  }
  
  /* ------------------------------------- */
  /* VARIANT YOUTUBE ..................... */
  /* ------------------------------------- */
  .mbYTP_wrapper {
    width: 100vw !important;
    min-width: 0 !important;
    left: 0 !important;
  }
  
  #player-nav {
    position: fixed;
    right: 0;
    top: 0;
    text-align: center;
  }
  #player-nav li {
    display: inline-block;
    background: transparent;
    height: 50px;
    width: 50px;
    line-height: 50px;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    -ms-border-radius: 0;
    border-radius: 0;
    -webkit-transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -ms-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
  #player-nav li:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  #player-nav li:hover a {
    color: #ffffff;
  }
  #player-nav li a {
    display: block;
    width: 100%;
    height: 100%;
    font-size: 1em;
    color: rgba(255, 255, 255, 0.7);
  }
  
  /* ------------------------------------- */
  /* VARIANT CONSTELLATION ............... */
  /* ------------------------------------- */
  #constellationel {
    z-index: 1;
    left: 0;
    top: 0;
    position: absolute;
  }
  
  /* ------------------------------------- */
  /* VARIANT FLAT SURFACE SHADER ......... */
  /* ------------------------------------- */
  #fss-part {
    background: transparent !important;
  }
  
  #container {
    height: 100%;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
  }
  
  .back-fss {
    height: 100%;
    position: absolute;
    width: 100%;
  }
  
  /* ------------------------------------- */
  /* VARIANT MOZAIC ...................... */
  /* ------------------------------------- */
  #dotty {
    position: fixed;
    top: 0;
    left: 0;
  }
  
  /* ------------------------------------- */
  /* VARIANT BUBBLE ...................... */
  /* ------------------------------------- */
  canvas {
    position: fixed;
    top: 0;
    left: 0;
  }
  canvas#canvasbg {
    background: #849af6;
  }
  
  /* ------------------------------------- */
  /* GALLERY PHOTOS ...................... */
  /* ------------------------------------- */
  .pswp__bg {
    background: #20232d;
  }
  
  .pswp__caption h4 {
    margin-bottom: 10px !important;
  }
  
  /* ------------------------------------- */
  /* 8. Media Queries .................... */
  /* ------------------------------------- */
  /* Large Devices, Wide Screens */
  /* Notebook devices */
  @media only screen and (max-width: 1199px) {
    #home .content {
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  
    .box-info {
      padding: 0;
    }
  
    .box-info-light,
    .box-info-dark {
      margin: 0 0 4rem !important;
    }
  
    .photo-line figure {
      padding: 0;
      margin: 0 0 4rem !important;
      width: 100% !important;
    }
    .photo-line figure:last-child {
      margin-bottom: 0 !important;
    }
  
    #right-side .content span.separator {
      width: calc(100% + 30px);
      margin-left: -15px;
    }
  
    .box-info:last-child .equalizer {
      margin-bottom: 0 !important;
    }
  }
  /* Medium Devices, Desktops */
  @media only screen and (max-width: 1024px) {
    .overlay {
      left: 0;
      width: 100%;
      height: 100%;
    }
    .overlay.skew-part {
      -webkit-transform: skew(0deg, 0deg);
      -moz-transform: skew(0deg, 0deg);
      -ms-transform: skew(0deg, 0deg);
      -o-transform: skew(0deg, 0deg);
      transform: skew(0deg, 0deg);
    }
  
    #container {
      height: 100%;
      position: absolute;
      width: 100%;
      left: 0;
    }
  
    .brand-logo {
      position: relative;
      left: auto;
      margin: 2rem auto;
      display: block;
    }
  
    .light-btn {
      padding: 0.7em 0;
      margin-right: 0;
      float: none;
      margin: 0 auto;
      margin-bottom: 15px;
      max-width: 50%;
    }
  
    .action-btn {
      padding: 0.7em 0;
      float: none;
      margin: 0 auto;
      max-width: 50%;
    }
  
    .outer-home {
      position: relative;
      height: auto !important;
    }
  
    #home {
      position: relative;
      width: 100%;
      height: auto;
      padding: 7rem 0 14rem;
    }
    #home .content {
      position: relative;
      left: 50%;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      -o-transform: translateX(-50%);
      transform: translateX(-50%);
      top: auto;
      text-align: center;
    }
    #home.minimize-left {
      -webkit-transform: perspective(0) rotateY(0) translateX(0) scale(1);
      -moz-transform: perspective(0) rotateY(0) translateX(0) scale(1);
      -ms-transform: perspective(0) rotateY(0) translateX(0) scale(1);
      -o-transform: perspective(0) rotateY(0) translateX(0) scale(1);
      transform: perspective(0) rotateY(0) translateX(0) scale(1);
      opacity: 1 !important;
    }
  
    .layer-left,
    .border-right-side {
      display: none !important;
    }
  
    .social-icons {
      left: 0;
      bottom: 0;
      margin-left: 0;
      margin-bottom: 0;
    }
  
    #right-side {
      position: relative;
      right: 0;
      top: 0;
      width: 100%;
    }
    #right-side .content {
      padding: 10rem 8rem;
    }
    #right-side.hide-right {
      right: 0;
    }
  
    #close-more-info {
      display: none;
    }
  
    .mCSB_scrollTools {
      /* Scrollbar */
      width: 5px;
      height: 100vh;
      margin-top: 0;
    }
    .mCSB_scrollTools .mCSB_draggerRail {
      width: 5px;
    }
    .mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar {
      /* the dragger element */
      width: 5px;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      -ms-border-radius: 0;
      border-radius: 0;
    }
  
    .mCSB_scrollTools {
      right: 0;
    }
  
    .mCSB_scrollTools-left {
      right: 0 !important;
    }
  }
  /* Small Devices, Tablets */
  @media only screen and (max-width: 768px) {
    .light-btn {
      max-width: 70%;
      min-width: 60%;
    }
  
    .action-btn {
      max-width: 70%;
      min-width: 60%;
    }
  
    .info-contact .item-map:first-child {
      padding-left: 0;
    }
    .info-contact .item-map:last-child {
      padding-right: 0;
    }
  
    .dialog__content {
      width: 80%;
      max-width: 80%;
      min-width: 75%;
    }
  
    .dialog .dialog-inner {
      padding: 40px 20px 90px;
      overflow: hidden;
    }
    .dialog .close-newsletter {
      background: transparent;
    }
  }
  /* Extra Small Devices, Phones */
  @media only screen and (max-width: 480px) {
    #home {
      padding: 5rem 0 0;
    }
    #home .content {
      padding: 0 2rem;
    }
    #home.minimal-phone {
      height: 100vh;
    }
  
    #right-side .content {
      padding: 5rem 4rem;
    }
  
    h1.text-intro {
      font-size: 3rem;
    }
  
    p.text-intro {
      font-size: 1.5rem;
    }
  
    .light-btn {
      max-width: 80%;
      min-width: 70%;
    }
  
    .action-btn {
      max-width: 80%;
      min-width: 70%;
    }
  
    .bottom-home {
      position: relative;
      height: auto;
      text-align: center;
      margin-top: 7rem;
    }
  
    .social-icons {
      position: relative;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      -webkit-transition: all 0.7s ease-in-out;
      -moz-transition: all 0.7s ease-in-out;
      -ms-transition: all 0.7s ease-in-out;
      -o-transition: all 0.7s ease-in-out;
      transition: all 0.7s ease-in-out;
    }
    .social-icons i {
      color: white;
    }
    .social-icons a {
      color: white;
      float: none;
    }
    .social-icons a:hover {
      background: transparent;
    }
  
    .copyright {
      position: relative;
      right: auto;
    }
  
    .dialog__content {
      width: 95%;
      max-width: 95%;
      min-width: 75%;
    }
  
    .dialog .close-newsletter {
      top: 2px;
      right: 5px;
    }
    .dialog .dialog-inner {
      padding: 40px 20px 50px;
    }
    .dialog .dialog-inner h4 {
      font-size: 25px;
      margin-bottom: 20px;
    }
  
    #subscribe .block-message {
      padding: 5px 2px;
    }
    #subscribe p.notify-valid {
      font-size: 12px;
    }
  }
  /* Only for tablet in landscape mode */
  /* Only for phone in landscape mode */
  @media screen and (max-device-width: 667px) and (orientation: landscape) {
    #home {
      padding: 50px 0 100px;
    }
  
    h1.text-intro {
      font-size: 30px;
    }
  
    h2.text-intro {
      font-size: 18px;
    }
  
    .dialog__content {
      width: 100%;
      max-width: 100%;
      min-width: 75%;
    }
  
    .dialog .close-newsletter {
      top: 2px;
      right: 5px;
    }
    .dialog .dialog-inner {
      padding: 40px 20px 50px;
    }
    .dialog .dialog-inner h4 {
      font-size: 25px;
      margin-bottom: 5px;
    }
  
    #subscribe #notifyMe {
      margin-top: 10px;
    }
    #subscribe #notifyMe .form-group .form-control {
      width: 70%;
      margin: 0;
      float: left;
    }
    #subscribe #notifyMe .form-group button.submit {
      width: 30%;
      margin: 0;
      float: left;
    }
    #subscribe .block-message {
      padding: 5px 2px;
    }
    #subscribe p.notify-valid {
      font-size: 12px;
    }
  }
  `;
  return style;
}
