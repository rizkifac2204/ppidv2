import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  labelTingkat,
  conditionWill,
  conditionFilterUser,
  conditionWillSpesific,
} from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  // ambil jumlah user
  const user = await db
    .from("admin")
    .count("id", { as: "jumlah" })
    .modify((builder) => conditionFilterUser(builder, req.session.user))
    .first();

  // ambil jumlah permohonan
  const online = await db
    .from("tbl_permohonan")
    .count("id", { as: "jumlah" })
    .whereNull("deleted_at")
    .modify((builder) => conditionWill(db, builder, req.session.user))
    .first();

  // ambil jumlah permohonan offline
  const offline = await db
    .from("tbl_permohonan_offline")
    .count("id", { as: "jumlah" })
    .whereNull("deleted_at")
    .modify((builder) => conditionWill(db, builder, req.session.user))
    .first();

  // ambil jumlah survey
  const survey = await db
    .from("tbl_survey")
    .count("id", { as: "jumlah" })
    .modify((builder) => conditionWill(db, builder, req.session.user))
    .first();

  // ambil jumlah keberatan
  const keberatan = await db
    .from("tbl_permohonan_keberatan")
    .count("tbl_permohonan_keberatan.id", { as: "jumlah" })
    .innerJoin(
      "tbl_permohonan",
      "tbl_permohonan_keberatan.id_permohonan",
      "tbl_permohonan.id"
    )
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
    )
    .first();

  // return hasil
  res.json({
    message: "Succes",
    tingkat: labelTingkat(req.session.user.level),
    jumlahUser: user.jumlah,
    jumlahOnline: online.jumlah,
    jumlahOffline: offline.jumlah,
    jumlahSurvey: survey.jumlah,
    jumlahKeberatan: keberatan.jumlah,
  });
});
