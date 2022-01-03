import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id } = req.query;

  const data = await db.from("tbl_survey").where({ id }).first();

  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

  const result = {
    detail: data,
  };

  res.json(result);
});
