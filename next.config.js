module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/admin/permohonan",
        destination: "/admin/permohonan/online",
        permanent: true,
      },
    ];
  },
};
