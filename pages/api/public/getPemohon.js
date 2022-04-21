import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";

export default PublicHandler().post(async (req, res) => {
  const { email_pemohon } = req.body;

  const data = await db
    .select("*")
    .from("pemohon")
    .where("email_pemohon", email_pemohon)
    .first();

  if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });
  res.json(data);
});
