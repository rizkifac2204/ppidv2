module.exports = {
  presets: ["next/babel"],
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/admin/permohonan",
        destination: "/admin/permohonan/online",
        permanent: true,
      },
      {
        source: "/admin/setting",
        destination: "/admin/setting/wilayah",
        permanent: true,
      },
    ];
  },
};
