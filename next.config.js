module.exports = {
  env: {
    NEXT_PUBLIC_HOST: process.env.HOST,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_TYNI_MCE_API:
      "mgdq5xn0ze8c48b5urdackwvsitkys648xw6lvt5ea9s40qy",
    NEXT_PUBLIC_MAPS: "AIzaSyB1trWMRh0qk1rIG7_G6xxcsxdJvTa7yFg",
    NEXT_PUBLIC_CAPTCHA_KEY: "6LdjOSEbAAAAAPpiQx4CHHjm1LL_oB3BYx7FTeJR",
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/admin/setting",
        destination: "/admin/setting/wilayah",
        permanent: true,
      },
    ];
  },
};

// 27838850976-2ch473tnh2tvf8d377e91to8a9qqjvhb.apps.googleusercontent.com
// 1011746210255-hclqtau5lv77hnfstbsscltfc4sai57c.apps.googleusercontent.com
