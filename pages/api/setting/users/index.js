import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import { conditionFilterUser } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "admin.*",
        "bawaslu.level_bawaslu",
        db.raw(
          `IF(${req.session.user.level} < bawaslu.level_bawaslu, true, false) as editable,
          IF(${req.session.user.id} = admin.id, true, false) as myself`
        )
      )
      .from("admin")
      .innerJoin("bawaslu", "admin.bawaslu_id", "bawaslu.id")
      .modify((builder) => conditionFilterUser(builder, req.session.user))
      .orderBy("bawaslu.level_bawaslu")
      .whereNull("admin.deleted_at");

    res.json(result);
  })
  .post(async (req, res) => {
    const {
      level,
      nama_admin,
      telp_admin,
      email_admin,
      alamat_admin,
      username,
      password,
    } = req.body;
    var bawaslu_id;
    var id_prov = req.body.id_prov;
    var id_kabkota = req.body.id_kabkota;

    // validasi (double cek)
    if (level == 1) {
      var bawaslu_id = 0;
    }
    if (level === 2) {
      if (!id_prov)
        return res.status(400).json({
          message: "Provinsi Harus Diisi",
          type: "error",
        });
      var bawaslu_id = id_prov;
    }
    if (level === 3) {
      if (!id_kabkota)
        return res
          .status(400)
          .json({ message: "Kabupaten/Kota Harus Diisi", type: "error" });
      var bawaslu_id = id_kabkota;
    }

    // cek data login sama
    const cek = await db("admin").where("username", username).first();
    // Jika ada yang sama
    if (cek)
      return res
        .status(400)
        .json({ message: "Mohon Ganti Username Pengganti", type: "error" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // proses insert data bawaslu jika belum ada
    const cekDataBawaslu = await db("bawaslu").where("id", bawaslu_id);
    if (!cekDataBawaslu) {
      const insertDataBawaslu = await db("bawaslu").insert([
        {
          id: bawaslu_id,
          provinsi_id: id_prov,
          level_bawaslu: level,
        },
      ]);
      // failed
      if (!insertDataBawaslu)
        return res.status(400).json({
          message: "Terjadi Kesalahan Sistem Memasukan Data Bawaslu",
        });
    }

    // proses simpan user/admin
    const proses = await db("admin").insert([
      {
        nama_admin,
        telp_admin,
        email_admin,
        alamat_admin,
        username,
        password: hash,
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
    const proses = await db("admin")
      .whereIn("id", arrID)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Menghapus Data", type: "success" });
  });
