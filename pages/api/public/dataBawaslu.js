import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const data = await db
    .select("bawaslu.*", "provinsi.provinsi", "kabkota.kabkota")
    .from("bawaslu")
    .leftJoin("provinsi", "provinsi.id", "bawaslu.id")
    .leftJoin("kabkota", "kabkota.id", "bawaslu.id")
    .orderBy("bawaslu.id", "asc");

  if (!data) return res.status(404).json({ message: "Terjadi Kesalahan" });

  res.json(data);
});
