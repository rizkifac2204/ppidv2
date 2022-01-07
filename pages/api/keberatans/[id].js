import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const data = await db
      .select(
        "tbl_permohonan_keberatan.id",
        "tbl_permohonan_keberatan.kasus",
        "tbl_permohonan_keberatan.created_at",
        "tbl_permohonan.tiket_number",
        "tbl_permohonan.reg_number"
      )
      .from("tbl_permohonan_keberatan")
      .innerJoin(
        "tbl_permohonan",
        "tbl_permohonan.id",
        "tbl_permohonan_keberatan.id_permohonan"
      )
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .whereNull("tbl_permohonan.deleted_at")
      .where("tbl_permohonan_keberatan.id", id)
      .first();

    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(data);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("tbl_survey").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
