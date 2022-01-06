import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWill, conditionWillSpesific } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const online = await db
    .from("tbl_permohonan")
    .whereNull("tbl_permohonan.deleted_at")
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
    )
    .select("tbl_permohonan_response.status")
    .count({ jumlah: "tbl_permohonan.id" })
    .leftJoin(
      "tbl_permohonan_response",
      "tbl_permohonan.id",
      "tbl_permohonan_response.id_permohonan"
    )
    .groupBy("tbl_permohonan_response.status");

  const offline = await db
    .from("tbl_permohonan_offline")
    .whereNull("deleted_at")
    .modify((builder) => conditionWill(db, builder, req.session.user))
    .select("status")
    .count({ jumlah: "id" })
    .groupBy("status");

  // return hasil
  res.status(200).json({
    message: "Success",
    online,
    offline,
  });
});
