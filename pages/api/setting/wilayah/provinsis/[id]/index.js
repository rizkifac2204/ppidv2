import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id } = req.query;
  const data = await db("tbl_provinsi").where("id", id).first();

  const kabkot = await db("tbl_kabupaten")
    .where("id_prov", id)
    .orderBy("kabupaten", "asc");

  const result = {
    result: data,
    kabkot: kabkot,
  };
  res.json(result);
});
