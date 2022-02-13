import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

function filter(builder, f, table) {
  if (f.tahun) builder.whereRaw(`YEAR(${table}.tanggal) = ?`, [f.tahun]);
  if (f.unit) builder.whereRaw(`${table}.kepada = ?`, [f.unit]);
  if (f.prov && !f.kab) {
    builder.whereRaw(`${table}.id_will = ?`, [f.prov]);
  }
  if (f.prov && f.kab) {
    builder.whereRaw(`${table}.id_will = ?`, [f.kab]);
  }
}

export default Handler().get(async (req, res) => {
  const { chart } = req.query;

  if (chart === "jumlahpermohonan") {
    const result = await db("tbl_permohonan_offline")
      .count("tbl_permohonan_offline.id", { as: "value" })
      .select(
        db.raw("DATE_FORMAT(tbl_permohonan_offline.tanggal, '%M %Y') AS label")
      )
      .whereNull("tbl_permohonan_offline.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan_offline"))
      .groupBy(
        db.raw(
          "YEAR(tbl_permohonan_offline.tanggal), MONTH(tbl_permohonan_offline.tanggal)"
        )
      );
    return res.json(result);
  }

  if (chart === "latarbelakang") {
    const result = await db("tbl_permohonan_offline")
      .count("tbl_permohonan_offline.id", { as: "value" })
      .select(db.raw("tbl_permohonan_offline.pekerjaan AS text"))
      .whereNull("tbl_permohonan_offline.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan_offline"))
      .groupBy("text");
    return res.json(result);
  }

  if (chart === "status") {
    const result = await db("tbl_permohonan_offline")
      .count("tbl_permohonan_offline.id", { as: "value" })
      .select(db.raw("tbl_permohonan_offline.status AS label"))
      .whereNull("tbl_permohonan_offline.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan_offline"))
      .groupBy("label");
    return res.json(result);
  }

  if (chart === "alasan") {
    const result = await db("tbl_permohonan_offline")
      .count("tbl_permohonan_offline.id", { as: "value" })
      .select(db.raw("tbl_permohonan_offline.alasan AS label"))
      .whereNull("tbl_permohonan_offline.deleted_at")
      .whereNotNull("tbl_permohonan_offline.alasan")
      .where("tbl_permohonan_offline.alasan", "!=", "")
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan_offline"))
      .groupBy("label");
    return res.json(result);
  }

  res.json({ message: "Not Body Query Detected" });
});
