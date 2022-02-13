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
    const result = await db("tbl_permohonan")
      .count("tbl_permohonan.id", { as: "value" })
      .select(db.raw("DATE_FORMAT(tbl_permohonan.tanggal, '%M %Y') AS label"))
      .whereNull("tbl_permohonan.deleted_at")
      .modify((builder) => filter(builder, req.query, "tbl_permohonan"))
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .groupBy(
        db.raw("YEAR(tbl_permohonan.tanggal), MONTH(tbl_permohonan.tanggal)")
      );
    return res.json(result);
  }

  if (chart === "latarbelakang") {
    const result = await db("tbl_permohonan")
      .count("tbl_permohonan.id", { as: "value" })
      .select(db.raw("tbl_permohonan.pekerjaan AS text"))
      .whereNull("tbl_permohonan.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan"))
      .groupBy("text");
    return res.json(result);
  }

  if (chart === "status") {
    const result = await db("tbl_permohonan")
      .count("tbl_permohonan.id", { as: "value" })
      .select(
        db.raw(
          "IFNULL(tbl_permohonan_response.status, 'Belum Di Response') AS label"
        )
      )
      .leftJoin(
        "tbl_permohonan_response",
        "tbl_permohonan.id",
        "tbl_permohonan_response.id_permohonan"
      )
      .whereNull("tbl_permohonan.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan"))
      .groupBy("label");
    return res.json(result);
  }

  if (chart === "alasan") {
    const result = await db("tbl_permohonan")
      .count("tbl_permohonan.id", { as: "value" })
      .select(db.raw("tbl_permohonan_response.alasan AS label"))
      .innerJoin("tbl_permohonan_response", function () {
        this.on(
          "tbl_permohonan.id",
          "=",
          "tbl_permohonan_response.id_permohonan"
        ).andOn(function () {
          this.on(
            "tbl_permohonan_response.status",
            "=",
            db.raw("?", ["Diberikan Sebagian"])
          ).orOn(
            "tbl_permohonan_response.status",
            "=",
            db.raw("?", ["Tidak Dapat Diberikan"])
          );
        });
      })
      .whereNull("tbl_permohonan.deleted_at")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .modify((builder) => filter(builder, req.query, "tbl_permohonan"))
      .groupBy("label");
    return res.json(result);
  }

  res.json({ message: "Not Body Query Detected" });
});
