import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const data = await db
    .select(
      "tbl_users.*",
      "tbl_level.nama_level",
      "tbl_provinsi.provinsi",
      "tbl_kabupaten.kabupaten"
    )
    .from("tbl_users")
    .leftJoin("tbl_level", "tbl_users.level", "tbl_level.id")
    .leftJoin("tbl_provinsi", "tbl_users.id_prov", "tbl_provinsi.id")
    .leftJoin("tbl_kabupaten", "tbl_users.id_kabkot", "tbl_kabupaten.id")
    .where("tbl_users.id", req.session.user.id)
    .first();

  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

  res.json(data);
});
