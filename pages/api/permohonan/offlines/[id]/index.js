import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const data = await db
      .select(
        "tbl_permohonan_offline.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_permohonan_offline")
      .leftJoin(
        "tbl_provinsi",
        "tbl_permohonan_offline.id_will",
        "tbl_provinsi.id"
      )
      .leftJoin(
        "tbl_kabupaten",
        "tbl_permohonan_offline.id_will",
        "tbl_kabupaten.id"
      )
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .whereNull("tbl_permohonan_offline.deleted_at")
      .where("tbl_permohonan_offline.id", id)
      .first();

    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(data);
  })
  .delete(async (req, res) => {
    const { id } = req.query;

    const proses = await db("tbl_permohonan_offline")
      .where("id", id)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Memindahkan Ke Sampah", type: "success" });
  });
