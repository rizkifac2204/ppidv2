import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionWillSpesific,
  labelKepada,
  createWill,
} from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { status } = req.query;
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
      .modify((builder) => {
        if (status) {
          if (status === "draft") builder.where("tbl_email_send.status", 0);
          if (status === "send") builder.where("tbl_email_send.status", 1);
        }
      })
      .orderBy("tbl_email_send.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    console.log(req.body);
    const { level, id_prov, id_kabkot } = req.session.user;
    const { penerima, subjek, isi } = req.body;
    var daftar_penerima = req.body.daftar_penerima;

    if (penerima === "Select") {
      if (!daftar_penerima)
        return res.status(400).json({
          message: "Daftar Penerima Tidak Terdeteksi",
        });
    } else {
      daftar_penerima = null;
    }

    // proses simpan
    const proses = await db("tbl_email_send").insert([
      {
        nama,
        email,
        kepada: labelKepada(level),
        id_will: createWill(level, id_prov, id_kabkot),
      },
    ]);

    // // failed
    // if (!proses)
    //   return res.status(400).json({
    //     message: "Gagal Memproses Data",
    //   });

    // // success
    // res.json({ message: "Berhasil Memproses Data", type: "success" });
  })
  // delete one by one
  .put(async (req, res) => {
    const { id } = req.body;
    const proses = await db("tbl_email_send").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  })
  // proses hapus data terpilih
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_email_send").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Sukses Menghapus Data Terpilih", type: "success" });
  });
