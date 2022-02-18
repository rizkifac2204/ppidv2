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
  res.json({ db_host, db_name, db_user, db_pass });
});
