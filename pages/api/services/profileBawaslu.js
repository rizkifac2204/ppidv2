import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const { id } = req.query;
  const data = await db
    .from("bawaslu")
    .select("bawaslu.*", "admin.nama_admin")
    .innerJoin("admin", function () {
      this.on("bawaslu.id", "=", "admin.bawaslu_id");
    })
    .where("bawaslu.id", id)
    .first();

  if (!data)
    return res.json({
      email: "Tidak Ditemukan",
      telp: "Tidak Ditemukan",
      kota: "Tidak Ditemukan",
      alamat: "Tidak Ditemukan",
      nama: "Tidak Ditemukan",
    });

  res.json(data);
});
