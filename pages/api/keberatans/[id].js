import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const data = await db
      .select(
        "permohonan_keberatan.id",
        "permohonan_keberatan.kasus_posisi",
        "permohonan_keberatan.created_at",
        "permohonan_keberatan.tanggal_keberatan",
        "permohonan_keberatan.alasan_a",
        "permohonan_keberatan.alasan_b",
        "permohonan_keberatan.alasan_c",
        "permohonan_keberatan.alasan_d",
        "permohonan_keberatan.alasan_e",
        "permohonan_keberatan.alasan_f",
        "permohonan_keberatan.alasan_g",
        "permohonan.tiket",
        "permohonan.no_registrasi",
        "permohonan.bawaslu_id",
        "permohonan.rincian",
        "permohonan.tujuan",
        "permohonan.cara_terima",
        "permohonan.cara_dapat",
        "pemohon.nama_pemohon",
        "pemohon.pekerjaan_pemohon",
        "pemohon.telp_pemohon",
        "pemohon.email_pemohon",
        "pemohon.alamat_pemohon",
        "pemohon.identitas_pemohon"
      )
      .from("permohonan_keberatan")
      .innerJoin(
        "permohonan",
        "permohonan.id",
        "permohonan_keberatan.permohonan_id"
      )
      .innerJoin("pemohon", "pemohon.email_pemohon", "permohonan.email_pemohon")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .whereNull("permohonan.deleted_at")
      .where("permohonan_keberatan.id", id)
      .first();

    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(data);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("permohonan_keberatan").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
