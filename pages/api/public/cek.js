import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().post(async (req, res) => {
  const { tiket, email_pemohon } = req.body;

  const data = await db
    .select(
      "permohonan.*",
      "permohonan_respon.pesan",
      "permohonan_respon.file_informasi",
      "bawaslu.*",
      "pemohon.nama_pemohon",
      "pemohon.alamat_pemohon"
    )
    .from("permohonan")
    .innerJoin("pemohon", "pemohon.email_pemohon", "permohonan.email_pemohon")
    .leftJoin("bawaslu", "bawaslu.id", "permohonan.bawaslu_id")
    .leftJoin(
      "permohonan_respon",
      "permohonan.id",
      "permohonan_respon.permohonan_id"
    )
    .whereNull("permohonan.deleted_at")
    .andWhere("permohonan.tiket", tiket)
    .andWhere("permohonan.email_pemohon", email_pemohon)
    .first();

  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });
  res.json(data);
});
