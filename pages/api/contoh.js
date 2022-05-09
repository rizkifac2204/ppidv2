import nextConnect from "next-connect";

function Handler() {
  return nextConnect({
    onError: (err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.toString(), type: "error" });
    },
    onNoMatch: () => {
      res.status(404).json({ message: "Not found", type: "error" });
    },
  });
}

export default Handler().get(async (req, res) => {
  const db_host = process.env.DB_HOST;
  const db_name = process.env.DB_NAME;
  const db_user = process.env.DB_USER;
  const db_pass = process.env.DB_PASS;
  const email_host = process.env.EMAIL_HOST;
  const email_pass = process.env.EMAIL_PASS;
  const email_user = process.env.EMAIL_USER;
  const g_i = process.env.GOOGLE_CLIENT_ID;
  const g_s = process.env.GOOGLE_CLIENT_SECRET;
  const host = process.env.HOST;
  const jwt = process.env.JWT_SECRET_KEY;
  const nxurl = process.env.NEXTAUTH_URL;
  const port = process.env.PORT;

  const dev = process.env.NODE_ENV !== "production";

  res.json({
    all: process.env,
    part: {
      db_host,
      db_name,
      db_user,
      db_pass,
      email_host,
      email_pass,
      email_user,
      g_i,
      g_s,
      host,
      jwt,
      nxurl,
      port,
    },
    dev,
  });
});
