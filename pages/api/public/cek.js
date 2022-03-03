import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().post(async (req, res) => {
  const { tiket_number, email } = req.body;

  const data = await db
    .select(
      "tbl_permohonan.*",
      "tbl_permohonan_response.status",
      "tbl_permohonan_response.file",
      "tbl_permohonan_response.alasan",
      "tbl_provinsi.provinsi",
      "tbl_kabupaten.kabupaten"
    )
    .from("tbl_permohonan")
    .leftJoin("tbl_provinsi", "tbl_permohonan.id_will", "tbl_provinsi.id")
    .leftJoin("tbl_kabupaten", "tbl_permohonan.id_will", "tbl_kabupaten.id")
    .leftJoin(
      "tbl_permohonan_response",
      "tbl_permohonan.id",
      "tbl_permohonan_response.id_permohonan"
    )
    .whereNull("tbl_permohonan.deleted_at")
    .andWhere("tbl_permohonan.tiket_number", tiket_number)
    .andWhere("tbl_permohonan.email", email)
    .first();

  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });
  res.json(data);
});
