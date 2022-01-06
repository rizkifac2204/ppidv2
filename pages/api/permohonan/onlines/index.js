import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const result = await db
    .select(
      "tbl_permohonan.*",
      "tbl_provinsi.provinsi",
      "tbl_kabupaten.kabupaten",
      "tbl_permohonan_response.status",
      "tbl_permohonan_response.alasan",
      "tbl_permohonan_response.waktu",
      "tbl_permohonan_response.response",
      "tbl_permohonan_response.file"
    )
    .from("tbl_permohonan")
    .leftJoin("tbl_provinsi", "tbl_permohonan.id_will", "tbl_provinsi.id")
    .leftJoin("tbl_kabupaten", "tbl_permohonan.id_will", "tbl_kabupaten.id")
    .leftJoin(
      "tbl_permohonan_response",
      "tbl_permohonan.id",
      "tbl_permohonan_response.id_permohonan"
    )
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
    )
    .whereNull("tbl_permohonan.deleted_at")
    .orderBy("tbl_permohonan.created_at", "desc");

  res.json(result);
});
