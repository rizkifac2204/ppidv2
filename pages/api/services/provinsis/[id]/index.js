import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const { id } = req.query;
  const data = await db("provinsi").where("id", id).first();

  const kabkota = await db("kabkota")
    .where("provinsi_id", id)
    .orderBy("kabkota", "asc");

  const result = {
    result: data,
    kabkota: kabkota,
  };
  res.json(result);
});
