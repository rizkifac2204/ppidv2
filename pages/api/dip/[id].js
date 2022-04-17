import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const result = await db
      .select("dip.*", "bawaslu.nama_bawaslu", "divisi.nama_divisi")
      .from("dip")
      .leftJoin("bawaslu", "bawaslu.id", "dip.bawaslu_id")
      .leftJoin("divisi", "divisi.id", "dip.divisi_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "dip")
      )
      .where("dip.id", id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(result);
  })
  .put(async (req, res) => {
    const {
      id,
      sifat,
      materi,
      divisi_id,
      nama_dip,
      tahun,
      no_sk,
      penanggung_jawab,
      bentuk_informasi,
      jangka_waktu,
      link_file,
    } = req.body;

    const dataForEdit = {
      divisi_id,
      sifat,
      materi,
      nama_dip,
      tahun,
      no_sk,
      penanggung_jawab,
      bentuk_informasi,
      jangka_waktu,
      link_file,
    };

    const proses = await db("dip").where("id", id).update(dataForEdit);

    // failed
    if (!proses) return req.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Edit Data", type: "success" });
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("dip").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
