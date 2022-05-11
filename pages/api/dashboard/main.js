import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  labelTingkat,
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
  const permohonan = await db
    .from("permohonan")
    .count("id", { as: "jumlah" })
    .whereNull("deleted_at")
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "permohonan")
    )
    .first();

  // ambil jumlah survey
  const survey = await db
    .from("survey")
    .count("id", { as: "jumlah" })
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "survey")
    )
    .first();

  // ambil jumlah keberatan
  const keberatan = await db
    .from("permohonan_keberatan")
    .count("permohonan_keberatan.id", { as: "jumlah" })
    .innerJoin(
      "permohonan",
      "permohonan_keberatan.permohonan_id",
      "permohonan.id"
    )
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "permohonan")
    )
    .first();

  // ambil jumlah DIP
  const dip = await db
    .from("dip")
    .count("id", { as: "jumlah" })
    .whereNull("deleted_at")
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "dip")
    )
    .first();

  // return hasil
  res.json({
    message: "Succes",
    tingkat: labelTingkat(req.session.user.level),
    jumlahUser: user.jumlah,
    jumlahPermohonan: permohonan.jumlah,
    jumlahSurvey: survey.jumlah,
    jumlahKeberatan: keberatan.jumlah,
    jumlahDip: dip.jumlah,
  });
});
