import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().post(async (req, res) => {
  const { tiket, email_pemohon } = req.body;

  const data = await db
    .select(
      "permohonan.*",
      "pemohon.nama_pemohon",
      "pemohon.alamat_pemohon",
      "bawaslu.nama_bawaslu"
    )
    .from("permohonan")
    .innerJoin("pemohon", "pemohon.email_pemohon", "permohonan.email_pemohon")
    .leftJoin("bawaslu", "bawaslu.id", "permohonan.bawaslu_id")
    .whereNull("permohonan.deleted_at")
    .andWhere("permohonan.tiket", tiket)
    .andWhere("permohonan.email_pemohon", email_pemohon)
    .first();
  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

  const responses = await db
    .select("*")
    .from("permohonan_respon")
    .orderBy("id", "desc")
    .where("permohonan_id", data.id);
  if (responses.length !== 0) {
    data.responses = responses;
  }

  res.json(data);
});
