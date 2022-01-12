import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const data = await db
      .select(
        "tbl_permohonan.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_permohonan")
      .leftJoin("tbl_provinsi", "tbl_permohonan.id_will", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_permohonan.id_will", "tbl_kabupaten.id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .whereNull("tbl_permohonan.deleted_at")
      .where("tbl_permohonan.id", id)
      .first();

    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(data);
  })
  .delete(async (req, res) => {
    const { id } = req.query;

    const proses = await db("tbl_permohonan")
      .where("id", id)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Memindahkan Ke Sampah", type: "success" });
  });
