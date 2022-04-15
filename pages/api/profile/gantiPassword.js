import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import sha1 from "js-sha1";

export default Handler().put(async (req, res) => {
  const { id } = req.session.user;
  const { lama, baru } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashBaru = bcrypt.hashSync(baru, salt);
  // cek exist
  const cek = await db("admin").where("id", id).first();
  if (!cek) return res.status(401).json({ message: "User Tidak Terdeteksi" });

  // jika tidak sama
  const old = sha1(sha1(lama));
  const match = await bcrypt.compare(lama, cek.password);

  if (!match) {
    if (old !== cek.password)
      return res.status(401).json({ message: "Password Lama Anda Salah" });
  }
  // proses
  const proses = await db("admin")
    .where("id", id)
    .update({ password: hashBaru });
  // failed
  if (!proses)
    return res.status(400).json({ message: "Gagal Merubah Password" });
  // success
  res.json({ message: "Berhasil Merubah Password", type: "success" });
});
