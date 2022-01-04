import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  // cek user valid
  if (!req.session) return res.status(401).json({ message: "Siapa luh?" });
  const { level, id_prov, id_kabkot } = req.session.user;

  function tingkat(level) {
    if (level <= 2) return "Se-Nasional";
    if (level === 3) return "Se-Provinsi";
    if (level === 4) return "Se-Kabupaten/Kota";
    return null;
  }

  const condition1 = (builder) => {
    if (level <= 2) {
      builder.whereNot("level", 4);
    }
    if (level === 3) {
      builder.where("id_prov", "=", id_prov);
    }
    if (level === 4) {
      builder.where("id_kabkot", "=", id_kabkot);
    }
  };
  const condition2 = (builder) => {
    if (level <= 2) {
      builder.whereNotIn("id_will", db.from("tbl_kabupaten").select("id"));
    }
    if (level === 3) {
      builder.where("id_will", "like", `${id_prov}%`);
    }
    if (level === 4) {
      builder.where("id_will", "=", id_kabkot);
    }
  };

  // ambil jumlah user
  const user = await db
    .from("tbl_users")
    .count("id", { as: "jumlah" })
    .modify(condition1)
    .first();

  // ambil jumlah permohonan
  const online = await db
    .from("tbl_permohonan")
    .count("id", { as: "jumlah" })
    .whereNull("deleted_at")
    .modify(condition2)
    .first();

  // ambil jumlah permohonan offline
  const offline = await db
    .from("tbl_permohonan_offline")
    .count("id", { as: "jumlah" })
    .whereNull("deleted_at")
    .modify(condition2)
    .first();

  // ambil jumlah survey
  const survey = await db
    .from("tbl_survey")
    .count("id", { as: "jumlah" })
    .modify(condition2)
    .first();

  // return hasil
  res.status(200).json({
    message: "Succes",
    tingkat: tingkat(level),
    jumlahUser: user.jumlah,
    jumlahOnline: online.jumlah,
    jumlahOffline: offline.jumlah,
    jumlahSurvey: survey.jumlah,
  });
});
