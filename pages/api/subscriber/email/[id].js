import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await db
      .select("subscriber_email.*", "bawaslu.nama_bawaslu")
      .from("subscriber_email")
      .leftJoin("bawaslu", "bawaslu.id", "subscriber_email.bawaslu_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "subscriber_email")
      )
      .where("subscriber_email.id", id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    if (result.penerima === "Select") {
      const arrID = result.daftar_penerima.split(",");
      const listPenerima = await db
        .select("*")
        .from("subscriber")
        .whereIn("id", arrID)
        .orderBy("email_subscriber", "asc");
      result.listPenerima = listPenerima;
    }

    res.json(result);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("subscriber_email").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
