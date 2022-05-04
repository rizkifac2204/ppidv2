import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select("dip.*", "bawaslu.nama_bawaslu", "divisi.nama_divisi")
      .from("dip")
      .leftJoin("bawaslu", "bawaslu.id", "dip.bawaslu_id")
      .leftJoin("divisi", "divisi.id", "dip.divisi_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "dip")
      )
      .orderBy("dip.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { bawaslu_id } = req.session.user;
    const {
      sifat,
      jenis_informasi,
      divisi_id,
      ringkasan,
      tahun_pembuatan,
      no_sk,
      penanggung_jawab,
      bentuk_informasi,
      jangka_waktu,
      link_file,
    } = req.body;

    const dataForInsert = {
      bawaslu_id,
      divisi_id,
      sifat,
      jenis_informasi,
      ringkasan,
      tahun_pembuatan,
      no_sk,
      penanggung_jawab,
      bentuk_informasi,
      jangka_waktu,
      link_file,
    };

    // proses simpan
    const proses = await db("dip").insert(dataForInsert);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // success
    res.json({ message: "Berhasil Menginput Data", type: "success" });
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("dip").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Sukses Menghapus Data Terpilih", type: "success" });
  });
