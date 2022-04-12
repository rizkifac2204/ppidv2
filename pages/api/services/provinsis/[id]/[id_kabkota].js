import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const { id_kabkota } = req.query;
  const data = await db
    .select("kabkota.*", "kabkota_jenis.jenis")
    .from("kabkota")
    .innerJoin("kabkota_jenis", "kabkota_jenis.id", "kabkota.jenis_id")
    .where("kabkota.id", id_kabkota)
    .first();
  res.json(data);
});
