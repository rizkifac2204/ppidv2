import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import sha1 from "js-sha1";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "admin.*",
        "bawaslu.level_bawaslu",
        "bawaslu.nama_bawaslu",
        "level.level",
        "provinsi.provinsi"
      )
      .from("admin")
      .innerJoin("bawaslu", "admin.bawaslu_id", "bawaslu.id")
      .innerJoin("level", "bawaslu.level_bawaslu", "level.id")
      .leftJoin("provinsi", "bawaslu.provinsi_id", "provinsi.id")
      .orderBy("bawaslu.level_bawaslu")
      .where("admin.id", req.session.user.id)
      .first();

    if (!result) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(result);
  })
  .put(async (req, res) => {
    const { id } = req.session.user;
    const {
      nama_admin,
      telp_admin,
      email_admin,
      alamat_admin,
      username,
      password,
      passwordConfirm,
    } = req.body;

    const cek = await db("admin").where("id", id).first();
    if (!cek) return res.status(401).json({ message: "User Tidak Terdeteksi" });

    // // jika password tidak sama
    const old = sha1(sha1(passwordConfirm));
    const match = await bcrypt.compare(passwordConfirm, cek.password);

    if (!match) {
      if (old !== password)
        return res.status(401).json({ message: "Password Anda Salah" });
    }

    //cek jika ada email yang sama
    const cekEmailSama = await db("admin")
      .where("id", "!=", id)
      .andWhere("email_admin", email_admin)
      .first();
    if (cekEmailSama)
      return res.status(401).json({
        message:
          "Email yang anda masukan sudah di pakai user lain, silakan masukan email pengganti",
      });

    const proses = await db("admin").where("id", id).update({
      nama_admin,
      telp_admin,
      email_admin,
      alamat_admin,
      username,
      updated_at: db.fn.now(),
    });

    // failed
    if (!proses) return req.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Mengubah Data Profile" });
  });
