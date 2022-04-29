import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";
import { buatIDWill } from "middlewares/PublicCondition";

export default PublicHandler().post(async (req, res) => {
  const { email, kepada, id_prov, id_kabkota } = req.body;
  const bawaslu_id = buatIDWill(kepada, id_prov, id_kabkota);

  const cek = await db
    .select("id")
    .from("subscriber")
    .where("email_subscriber", email)
    .andWhere("bawaslu_id", bawaslu_id)
    .first();

  if (cek)
    return res.json({
      message: "Terimakasih, Anda Sudah Menjadi Bagian Dari Kami",
    });

  const simpan = await db("subscriber").insert({
    bawaslu_id,
    email_subscriber: email,
  });

  if (!simpan) return res.status(404).json({ message: "Terjadi Kesalahan" });

  res.json({
    message: "Terimakasih Sudah Berlangganan Berita Bawaslu",
  });
});
