import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import { conditionFilterUser } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "tbl_users.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten",
        "tbl_level.nama_level",
        db.raw(
          `IF(${req.session.user.level} < tbl_users.level, true, false) as editable,
          IF(${req.session.user.level} = tbl_users.id, true, false) as myself`
        )
      )
      .from("tbl_users")
      .innerJoin("tbl_level", "tbl_users.level", "tbl_level.id")
      .leftJoin("tbl_provinsi", "tbl_users.id_prov", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_users.id_kabkot", "tbl_kabupaten.id")
      .modify((builder) => conditionFilterUser(builder, req.session.user))
      .orderBy("tbl_users.level");

    res.json(result);
  })
  .post(async (req, res) => {
    const { level, nama, telp, email, alamat, username, password } = req.body;
    var id_prov = req.body.id_prov;
    var id_kabkot = req.body.id_kabkot;

    // validasi (double cek)
    if (level <= 2) {
      var id_prov = 0;
      var id_kabkot = 0;
    }
    if (level === 3) {
      if (!id_prov)
        return res.status(400).json({
          message: "Provinsi Harus Diisi",
          type: "error",
        });
      var id_kabkot = 0;
    }
    if (level === 4) {
      if (!id_prov)
        return res
          .status(400)
          .json({ message: "Provinsi Harus Diisi", type: "error" });
      if (!id_kabkot)
        return res
          .status(400)
          .json({ message: "Kabupaten/Kota Harus Diisi", type: "error" });
    }

    // cek reg number sama
    const cek = await db("tbl_users").where("username", username).first();
    // Jika ada yang sama
    if (cek)
      return res
        .status(400)
        .json({ message: "Mohon Ganti Username Pengganti", type: "error" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // proses simpan
    const proses = await db("tbl_users").insert([
      {
        level,
        nama,
        telp,
        email,
        alamat,
        username,
        password: hash,
        id_prov,
        id_kabkot,
        valid: 1,
        login: 0,
      },
    ]);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // success
    res.json({ message: "Berhasil Menginput User", type: "success" });
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_users")
      .whereIn("id", arrID)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Menghapus Data", type: "success" });
  });
