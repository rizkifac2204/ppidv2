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
  const { id_kabkota } = req.query;
  const data = await db
    .select("kabkota.*", "kabkota_jenis.jenis")
    .from("kabkota")
    .innerJoin("kabkota_jenis", "kabkota_jenis.id", "kabkota.jenis_id")
    .where("kabkota.id", id_kabkota)
    .first();
  res.json(data);
});

export default handler;
