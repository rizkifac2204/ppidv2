module.exports = {
  env: {
    NEXT_PUBLIC_HOST: process.env.HOST,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_TYNI_MCE_API: process.env.TYNI_MCE_API,
    NEXT_PUBLIC_MAPS: process.env.MAPS_KEY,
    NEXT_PUBLIC_CAPTCHA_KEY: process.env.CAPTCHA_KEY,
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
