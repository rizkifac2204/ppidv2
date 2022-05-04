import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

function filter(builder, f, table) {
  if (f.unit === "Bawaslu Republik Indonesia")
    builder.whereRaw(`${table}.bawaslu_id = ?`, [0]);
  if (f.id_prov && !f.id_kabkota) {
    builder.whereRaw(`${table}.bawaslu_id = ?`, [f.id_prov]);
  }
  if (f.id_prov && f.id_kabkota) {
    builder.whereRaw(`${table}.bawaslu_id = ?`, [f.id_kabkota]);
  }
}

export default PublicHandler().get(async (req, res) => {
  const result = await db
    .select("dip.*", "bawaslu.nama_bawaslu", "divisi.nama_divisi")
    .from("dip")
    .leftJoin("bawaslu", "bawaslu.id", "dip.bawaslu_id")
    .leftJoin("divisi", "divisi.id", "dip.divisi_id")
    .modify((builder) => filter(builder, req.query, "dip"))
    .orderBy("dip.sifat", "desc");

  res.json(result);
});
