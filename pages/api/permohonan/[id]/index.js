import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await db
      .select(
        "permohonan.*",
        "pemohon.*",
        "bawaslu.nama_bawaslu",
        "bawaslu.level_bawaslu",
        "provinsi.provinsi"
      )
      .from("permohonan")
      .innerJoin("bawaslu", "permohonan.bawaslu_id", "bawaslu.id")
      .innerJoin("pemohon", "pemohon.email_pemohon", "permohonan.email_pemohon")
      .leftJoin("provinsi", "provinsi.id", "bawaslu.provinsi_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .whereNull("permohonan.deleted_at")
      .where("permohonan.id", id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });
    res.json(result);
  })
  .delete(async (req, res) => {
    const { id } = req.query;

    const proses = await db("permohonan")
      .where("id", id)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Memindahkan Ke Sampah", type: "success" });
  });
