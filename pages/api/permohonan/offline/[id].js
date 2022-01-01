import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id } = req.query;
  const data = await db.from("tbl_permohonan_offline").where({ id }).first();
  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });
  res.json(data);
});
