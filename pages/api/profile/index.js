import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import sha1 from "js-sha1";

export default Handler()
  .get(async (req, res) => {
    const data = await db
      .select("admin.*", "bawaslu.nama_bawaslu")
      .from("admin")
      .innerJoin("bawaslu", "admin.bawaslu_id", "bawaslu.id")
      .where("admin.id", req.session.user.id)
      .first();
    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(data);
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

    const salt = bcrypt.genSaltSync(10);
    const hashPasswordConfirm = bcrypt.hashSync(passwordConfirm, salt);

    // // jika password tidak sama
    const old = sha1(sha1(passwordConfirm));
    const match = await bcrypt.compare(hashPasswordConfirm, password);

    if (!match) {
      if (old !== password)
        return res.status(401).json({ message: "Password Anda Salah" });
    }

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
