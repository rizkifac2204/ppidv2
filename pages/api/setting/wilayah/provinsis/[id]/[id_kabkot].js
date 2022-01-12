import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id_kabkot } = req.query;
  const data = await db("tbl_kabupaten").where("id", id_kabkot).first();
  res.json(data);
});
