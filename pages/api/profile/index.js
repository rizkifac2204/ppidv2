import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import sha1 from "js-sha1";

export default Handler()
  .get(async (req, res) => {
    const data = await db
      .select(
        "tbl_users.*",
        "tbl_level.nama_level",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_users")
      .leftJoin("tbl_level", "tbl_users.level", "tbl_level.id")
      .leftJoin("tbl_provinsi", "tbl_users.id_prov", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_users.id_kabkot", "tbl_kabupaten.id")
      .where("tbl_users.id", req.session.user.id)
      .first();

    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });

    res.json(data);
  })
  .put(async (req, res) => {
    const { id } = req.session.user;
    const { nama, telp, email, alamat, username, password, passwordConfirm } =
      req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashPasswordConfirm = bcrypt.hashSync(passwordConfirm, salt);

    // // jika password tidak sama
    const old = sha1(sha1(passwordConfirm));
    const match = await bcrypt.compare(hashPasswordConfirm, password);

    if (!match) {
      if (old !== password)
        return res.status(401).json({ message: "Password Anda Salah" });
    }

    const proses = await db("tbl_users")
      .where("id", id)
      .update({ nama, telp, alamat, email, username, updated_at: db.fn.now() });

    // failed
    if (!proses) return req.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Mengubah Data Profile" });
  });
