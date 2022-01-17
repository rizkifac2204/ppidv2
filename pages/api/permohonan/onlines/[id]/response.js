import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id } = req.query;
  const data = await db
    .from("tbl_permohonan_response")
    .where({ id_permohonan: id })
    .first();

  res.json(data);
});
