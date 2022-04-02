import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler().get(async (req, res) => {
  const { tahun, unit, prov, kab } = req.query;
  const result = await db
    .select("survey.*", "bawaslu.level_bawaslu")
    .from("survey")
    .innerJoin("bawaslu", "survey.bawaslu_id", "bawaslu.id")
    .modify((builder) =>
      conditionWillSpesific(db, builder, req.session.user, "survey")
    )
    .modify((builder) => {
      // filter tahun
      if (tahun) builder.whereRaw("YEAR(survey.created_at) = ?", [tahun]);
      // filter unit / level
      if (unit) builder.whereRaw("bawaslu.level_bawaslu = ?", [unit]);
      if (prov && !kab) {
        builder.whereRaw("survey.bawaslu_id = ?", [prov]);
      }
      if (prov && kab) {
        builder.whereRaw("survey.bawaslu_id = ?", [kab]);
      }
    })
    .orderBy("survey.created_at", "desc");
  res.json(result);
});
