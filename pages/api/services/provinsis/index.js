import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().get(async (req, res) => {
  const data = await db("provinsi").orderBy("provinsi", "asc");
  res.json(data);
});
