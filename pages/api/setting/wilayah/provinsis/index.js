import db from "libs/db";
import nextConnect from "next-connect";

const handler = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.toString(), type: "error" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ message: "Not found", type: "error" });
  },
}).get(async (req, res) => {
  const data = await db("tbl_provinsi").orderBy("provinsi", "asc");
  res.json(data);
});

export default handler;
