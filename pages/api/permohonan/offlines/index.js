import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const result = await db
    .select(
      "tbl_permohonan_offline.*",
      "tbl_provinsi.provinsi",
      "tbl_kabupaten.kabupaten"
    )
    .from("tbl_permohonan_offline")
    .leftJoin(
      "tbl_provinsi",
      "tbl_permohonan_offline.id_will",
      "tbl_provinsi.id"
    )
    .leftJoin(
      "tbl_kabupaten",
      "tbl_permohonan_offline.id_will",
      "tbl_kabupaten.id"
    )
    .modify((builder) =>
      conditionWillSpesific(
        db,
        builder,
        req.session.user,
        "tbl_permohonan_offline"
      )
    )
    .whereNull("tbl_permohonan_offline.deleted_at")
    .orderBy("tbl_permohonan_offline.tanggal", "desc");

  res.json(result);
});
