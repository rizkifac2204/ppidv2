import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  labelTingkat,
  conditionWill,
  conditionMainDashboard,
} from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  // ambil jumlah user
  const user = await db
    .from("tbl_users")
    .count("id", { as: "jumlah" })
    .modify((builder) => conditionMainDashboard(builder, req.session.user))
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

  // return hasil
  res.status(200).json({
    message: "Succes",
    tingkat: labelTingkat(req.session.user.level),
    jumlahUser: user.jumlah,
    jumlahOnline: online.jumlah,
    jumlahOffline: offline.jumlah,
    jumlahSurvey: survey.jumlah,
  });
});
