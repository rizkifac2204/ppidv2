import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await db
      .select(
        "tbl_email_send.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_email_send")
      .leftJoin("tbl_provinsi", "tbl_email_send.id_will", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_email_send.id_will", "tbl_kabupaten.id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_email_send")
      )
      .where("tbl_email_send.id", id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    if (result.penerima === "Select") {
      const arrID = result.daftar_penerima.split(",");
      const listPenerima = await db
        .select("*")
        .from("tbl_email_subscribe")
        .whereIn("id", arrID)
        .orderBy("email", "asc");
      result.listPenerima = listPenerima;
    }

    res.json(result);
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("tbl_email_send").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
