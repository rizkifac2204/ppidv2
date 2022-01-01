import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const data = await db.from("tbl_permohonan");
  res.json(data);
});
