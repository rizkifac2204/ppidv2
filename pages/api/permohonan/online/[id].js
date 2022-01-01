import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id } = req.query;

  const data = await db.from("tbl_permohonan").where({ id }).first();

  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

  const response = await db
    .from("tbl_permohonan_response")
    .where({ id_permohonan: id });

  const result = {
    detail: data,
    response: response,
  };

  res.json(result);
});
