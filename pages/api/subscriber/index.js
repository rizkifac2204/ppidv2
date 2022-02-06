import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionWillSpesific,
  labelKepada,
  createWill,
} from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    // pemanggilan ini dibuat berbeda karena tidak menggunakan tingkatan data
    // khusus subscriber instansi masing2
    const result = await db
      .select(
        "tbl_email_subscribe.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_email_subscribe")
      .leftJoin(
        "tbl_provinsi",
        "tbl_email_subscribe.id_will",
        "tbl_provinsi.id"
      )
      .leftJoin(
        "tbl_kabupaten",
        "tbl_email_subscribe.id_will",
        "tbl_kabupaten.id"
      )
      .modify((builder) => {
        if (req.session.user.level <= 2) {
          builder.where(`tbl_email_subscribe.id_will`, "=", `0`);
        }
        if (req.session.user.level === 3) {
          builder.where(
            `tbl_email_subscribe.id_will`,
            "=",
            `${req.session.user.id_prov}`
          );
        }
        if (req.session.user.level === 4) {
          builder.where(
            `tbl_email_subscribe.id_will`,
            "=",
            req.session.user.id_kabkot
          );
        }
      })
      .orderBy("tbl_email_subscribe.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { level, id_prov, id_kabkot } = req.session.user;
    const { nama, email } = req.body;

    // proses simpan
    const proses = await db("tbl_email_subscribe").insert([
      {
        nama,
        email,
        kepada: labelKepada(level),
        id_will: createWill(level, id_prov, id_kabkot),
      },
    ]);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // success
    res.json({ message: "Berhasil Menginput Data", type: "success" });
  })
  // delete one by one
  .put(async (req, res) => {
    const { id } = req.body;
    const proses = await db("tbl_email_subscribe").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  })
  // proses hapus data terpilih
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_email_subscribe").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Sukses Menghapus Data Terpilih", type: "success" });
  });
