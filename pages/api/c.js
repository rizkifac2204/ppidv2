import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const data = {
    HOST: process.env.HOST,
    PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    PUBLIC_TYNI_MCE_API: process.env.TYNI_MCE_API,
    PUBLIC_MAPS: process.env.MAPS_KEY,
    PUBLIC_CAPTCHA_KEY: process.env.CAPTCHA_KEY,
    PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    ALL: process.env,
  };
  res.json(data);
});
