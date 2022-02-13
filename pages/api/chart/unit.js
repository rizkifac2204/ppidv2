import db from "libs/db";
import Handler from "middlewares/Handler";

function filter(table, will, unit, tahun) {
  var lanjutan = `(SELECT COUNT(id) FROM ${table} where`;
  // filter unit
  if (!unit) {
    lanjutan += ` id_will LIKE CONCAT(${will}.id, '%')`;
  } else {
    lanjutan += ` id_will = ${will}.id`;
  }
  // filter tahun
  if (tahun) lanjutan += ` AND YEAR(${table}.tanggal) = ${tahun}`;
  // penutup
  lanjutan += ` and ${table}.deleted_at IS NULL) as value`;
  return lanjutan;
}

export default Handler().get(async (req, res) => {
  const { chart, tahun, unit, prov } = req.query;
  const table =
    chart === "online" ? "tbl_permohonan" : "tbl_permohonan_offline";
  const will = unit === "Bawaslu" ? "tbl_kabupaten" : "tbl_provinsi";
  const label = unit === "Bawaslu" ? "kabupaten" : "provinsi";

  const result = await db(will)
    .select(
      `${will}.id`,
      db.raw(`${will}.${label} AS label`),
      db.raw(filter(table, will, unit, tahun))
    )
    .modify((builder) => {
      if (unit === "Bawaslu") builder.whereRaw(`${will}.id_prov = ?`, [prov]);
    });

  return res.json(result);
});
