import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await db
      .select(
        `survey.*`,
        `bawaslu.nama_bawaslu`,
        `pemohon.*`,
        "provinsi.provinsi"
      )
      .from("survey")
      .innerJoin("bawaslu", "survey.bawaslu_id", "bawaslu.id")
      .innerJoin(`pemohon`, `survey.email_pemohon`, `pemohon.email_pemohon`)
      .leftJoin("provinsi", "provinsi.id", "bawaslu.provinsi_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "survey")
      )
      .where("survey.id", id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(result);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("survey").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
