import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const { id } = req.query;
  const data = await db
    .from("tbl_data_bawaslu")
    .where("id_wilayah", id)
    .first();

  if (!data)
    return res.json({
      email: "Tidak Ditemukan",
      telp: "Tidak Ditemukan",
      kota: "Tidak Ditemukan",
      alamat: "Tidak Ditemukan",
    });

  res.json(data);
});
