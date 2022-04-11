import db from "libs/db";
import Handler from "middlewares/Handler";
import { DeleteUpload } from "services/UploadService";

export default Handler()
  .get(async (req, res) => {
    const { id, respon_id } = req.query;
    const data = await db
      .select(
        `permohonan_respon.*`,
        `permohonan_respon_tolak.id as tolak_id`,
        `permohonan_respon_tolak.tanggal_ditolak`,
        `permohonan_respon_tolak.dasar_pengecualian`,
        `permohonan_respon_tolak.pada_pasal`,
        `permohonan_respon_tolak.ket_konsekuensi`
      )
      .from("permohonan_respon")
      .leftJoin(
        `permohonan_respon_tolak`,
        `permohonan_respon.id`,
        `permohonan_respon_tolak.respon_id`
      )
      .where({ "permohonan_respon.id": respon_id })
      .first();

    res.json(data);
  })
  .delete(async (req, res) => {
    const { id, respon_id } = req.query;

    const cek = await db
      .from("permohonan_respon")
      .where("id", respon_id)
      .first();
    DeleteUpload("./public/response", cek.file_informasi);
    DeleteUpload("./public/pemberitahuan", cek.file_surat_pemberitahuan);

    const proses = await db("permohonan_respon").where("id", respon_id).del();
    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });
    res.json({ message: "Berhasil Hapus", type: "success" });
  });
