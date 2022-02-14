module.exports = {
  env: {
    tynimceAPI: "mgdq5xn0ze8c48b5urdackwvsitkys648xw6lvt5ea9s40qy",
  },
  images: {
    domains: ["picsum.photos"],
  },
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
