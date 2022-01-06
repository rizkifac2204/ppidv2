import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const result = await db
    .from("tbl_permohonan")
    .count("tbl_permohonan.id", { as: "jumlah" })
    .select(
      "tbl_permohonan.kepada",
      "tbl_provinsi.provinsi",
      "tbl_kabupaten.kabupaten",
      "tbl_permohonan_response.status"
    )
    .leftJoin(
      "tbl_permohonan_response",
      "tbl_permohonan.id",
      "tbl_permohonan_response.id_permohonan"
    )
    .leftJoin("tbl_provinsi", "tbl_permohonan.id_will", "tbl_provinsi.id")
    .leftJoin("tbl_kabupaten", "tbl_permohonan.id_will", "tbl_kabupaten.id")
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
    )
    .whereNull("status")
    .whereNull("tbl_permohonan.deleted_at")
    .groupBy("tbl_permohonan.id_will")
    .orderBy("jumlah", "desc")
    .limit(5);

  // return hasil
  res.status(200).json({
    message: "Success",
    result,
  });
});
