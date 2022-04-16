import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

function filter(builder, f, table) {
  if (f.tahun) builder.whereRaw(`YEAR(${table}.created_at) = ?`, [f.tahun]);
  if (f.unit) builder.whereRaw(`bawaslu.level_bawaslu = ?`, [f.unit]);
  if (f.prov && !f.kab) {
    builder.whereRaw(`${table}.bawaslu_id = ?`, [f.prov]);
  }
  if (f.prov && f.kab) {
    builder.whereRaw(`${table}.bawaslu_id = ?`, [f.kab]);
  }
}

export default Handler().get(async (req, res) => {
  const { chart } = req.query;

  if (chart === "jumlahpermohonan") {
    const result = await db("permohonan")
      .count("permohonan.id", { as: "value" })
      .select(
        db.raw("DATE_FORMAT(permohonan.tanggal_permohonan, '%M %Y') AS label"),
        "bawaslu.level_bawaslu"
      )
      .innerJoin("bawaslu", "permohonan.bawaslu_id", "bawaslu.id")
      .whereNull("permohonan.deleted_at")
      .modify((builder) => filter(builder, req.query, "permohonan"))
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .groupBy(
        db.raw(
          "YEAR(permohonan.tanggal_permohonan), MONTH(permohonan.tanggal_permohonan)"
        )
      );
    return res.json(result);
  }

  if (chart === "latarbelakang") {
    const result = await db
      .from("pemohon")
      .count("pemohon.email_pemohon", { as: "value" })
      .select(
        db.raw("pemohon.pekerjaan_pemohon AS text"),
        "bawaslu.level_bawaslu"
      )
      .innerJoin(
        "permohonan",
        "permohonan.email_pemohon",
        "pemohon.email_pemohon"
      )
      .innerJoin("bawaslu", "permohonan.bawaslu_id", "bawaslu.id")
      .whereNull("permohonan.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .modify((builder) => filter(builder, req.query, "permohonan"))
      .groupBy("text");
    return res.json(result);
  }

  if (chart === "status") {
    const result = await db("permohonan")
      .count("permohonan.id", { as: "value" })
      .select({ label: "status_permohonan" }, "bawaslu.level_bawaslu")
      .innerJoin("bawaslu", "permohonan.bawaslu_id", "bawaslu.id")
      .whereNull("permohonan.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .modify((builder) => filter(builder, req.query, "permohonan"))
      .groupBy("label");
    return res.json(result);
  }

  if (chart === "platform") {
    const result = await db("permohonan")
      .count("permohonan.id", { as: "value" })
      .select({ label: "platform" }, "bawaslu.level_bawaslu")
      .innerJoin("bawaslu", "permohonan.bawaslu_id", "bawaslu.id")
      .whereNull("permohonan.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .modify((builder) => filter(builder, req.query, "permohonan"))
      .groupBy("label");
    return res.json(result);
  }

  res.json({ message: "Not Body Query Detected" });
});
