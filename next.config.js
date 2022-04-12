module.exports = {
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
