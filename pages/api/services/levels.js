import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler().get(async (req, res) => {
  const data = await db("level");
  res.json(data);
});
