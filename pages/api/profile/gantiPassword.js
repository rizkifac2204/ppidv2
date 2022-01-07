import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";

export default Handler().put(async (req, res) => {
  const { id } = req.session.user;
  const { lama, baru } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashLama = bcrypt.hashSync(lama, salt);
  const hashBaru = bcrypt.hashSync(baru, salt);
  // cek password
  const cek = await db("tbl_users").where("id", id).first();
  // jika tidak sama
  const match = await bcrypt.compare(hashLama, cek.password);
  if (!match)
    return res.status(401).json({ message: "Password Lama Anda Salah" });
  // proses
  const proses = await db("tbl_users")
    .where("id", id)
    .update({ password: hashBaru });
  // failed
  if (!proses)
    return res.status(400).json({ message: "Gagal Merubah Password" });
  // success
  res.json({ message: "Berhasil Menginput User", type: "success" });
});
