import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const data = await db("tbl_provinsi").orderBy("provinsi", "asc");
  res.json(data);
});
