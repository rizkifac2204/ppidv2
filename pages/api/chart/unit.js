import db from "libs/db";
import Handler from "middlewares/Handler";

function filter(will, unit, tahun) {
  var lanjutan = `(SELECT COUNT(id) FROM permohonan where 1`;
  // filter unit
  if (!unit) {
    lanjutan += ` AND bawaslu_id LIKE CONCAT(${will}.id, '%')`;
  } else {
    lanjutan += ` AND bawaslu_id = ${will}.id`;
  }
  // filter tahun
  if (tahun) lanjutan += ` AND YEAR(permohonan.created_at) = ${tahun}`;
  // penutup
  lanjutan += ` and permohonan.deleted_at IS NULL) as value`;
  return lanjutan;
}

export default Handler().get(async (req, res) => {
  const { tahun, unit, prov } = req.query;
  const will = unit === "3" ? "kabkota" : "provinsi";
  const label = unit === "3" ? "kabkota" : "provinsi";

  const result = await db(will)
    .select(
      `${will}.id`,
      db.raw(`${will}.${label} AS label`),
      db.raw(filter(will, unit, tahun))
    )
    .modify((builder) => {
      if (unit === "3") builder.whereRaw(`${will}.provinsi_id = ?`, [prov]);
    });

  return res.json(result);
});
