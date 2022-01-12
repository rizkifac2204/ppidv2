import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionMainDashboard } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await db
      .select("tbl_users.*", "tbl_provinsi.provinsi", "tbl_kabupaten.kabupaten")
      .from("tbl_users")
      .leftJoin("tbl_provinsi", "tbl_users.id_prov", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_users.id_kabkot", "tbl_kabupaten.id")
      .modify((builder) =>
        conditionMainDashboard(db, builder, req.session.user, "tbl_users")
      )
      .where("tbl_users.id", id)
      .first();
    res.json(result);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("tbl_users").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
