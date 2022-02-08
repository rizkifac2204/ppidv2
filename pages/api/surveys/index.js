import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { tahun } = req.query;
    const result = await db
      .select("tbl_survey.*")
      .from("tbl_survey")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_survey")
      )
      .modify((builder) => {
        if (tahun) builder.whereRaw("YEAR(tbl_survey.created_at) = ?", [tahun]);
      })
      .orderBy("tbl_survey.created_at", "desc");

    // console.log(result);
    res.json(result);
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_survey").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
