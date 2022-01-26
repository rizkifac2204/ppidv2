import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import { conditionFilterUser } from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;

    const result = await db
      .select(
        "tbl_users.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten",
        "tbl_level.nama_level",
        db.raw(
          `IF((${req.session.user.level} < tbl_users.level) OR false, true, false) as editable`
        )
      )
      .from("tbl_users")
      .innerJoin("tbl_level", "tbl_users.level", "tbl_level.id")
      .leftJoin("tbl_provinsi", "tbl_users.id_prov", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_users.id_kabkot", "tbl_kabupaten.id")
      .modify((builder) => conditionFilterUser(builder, req.session.user))
      .where("tbl_users.id", id)
      .first();
    res.json(result);
  })
  .put(async (req, res) => {
    const { id, nama, telp, email, alamat, username, passwordBaru } = req.body;

    // cek reg number sama
    const cek = await db("tbl_users")
      .where("username", username)
      .whereNot("id", id)
      .first();
    // Jika ada yang sama
    if (cek)
      return res
        .status(400)
        .json({ message: "Mohon Ganti Username Pengganti", type: "error" });

    const salt = bcrypt.genSaltSync(10);
    const hashPasswordBaru = bcrypt.hashSync(passwordBaru, salt);

    const proses = await db("tbl_users").where("id", id).update({
      nama,
      telp,
      alamat,
      email,
      username,
      password: hashPasswordBaru,
      updated_at: db.fn.now(),
    });

    // failed
    if (!proses) return req.status(400).json({ message: "Gagal Proses" });

    res.json({ message: "Berhasil Edit User", type: "success" });
  })
  .delete(async (req, res) => {
    const { id } = req.query;
    const proses = await db("tbl_users").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  });
