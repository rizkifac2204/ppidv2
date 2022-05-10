import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const data = await db
    .select("*")
    .from("provinsi")
    .whereIn("id", function () {
      this.select("bawaslu_id").from("admin");
    })
    .orderBy("provinsi", "asc");
  res.json(data);
});
