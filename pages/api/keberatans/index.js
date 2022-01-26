import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "tbl_permohonan_keberatan.id",
        "tbl_permohonan_keberatan.kasus",
        "tbl_permohonan_keberatan.created_at",
        "tbl_permohonan.tiket_number",
        "tbl_permohonan.reg_number",
        "tbl_permohonan.id_will"
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
      .whereNull("tbl_permohonan.deleted_at");

    res.json(result);
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_permohonan_keberatan")
      .whereIn("id", arrID)
      .del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
