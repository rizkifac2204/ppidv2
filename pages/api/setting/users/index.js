import db from "libs/db";
import Handler from "middlewares/Handler";
import bcrypt from "bcrypt";
import { conditionFilterUser } from "middlewares/Condition";

function capitalizeFirstLetter(words) {
  var separateWord = words.toLowerCase().split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  let fullWords = separateWord.join(" ");
  let modifiedWord = fullWords.replace("Kab.", "Kabupaten");
  return modifiedWord;
}

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "admin.*",
        "bawaslu.level_bawaslu",
        "bawaslu.nama_bawaslu",
        "level.level",
        "provinsi.provinsi",
        db.raw(
          `IF(${req.session.user.level} < bawaslu.level_bawaslu, true, false) as editable,
          IF(${req.session.user.id} = admin.id, true, false) as myself`
        )
      )
      .from("admin")
      .innerJoin("bawaslu", "admin.bawaslu_id", "bawaslu.id")
      .innerJoin("level", "bawaslu.level_bawaslu", "level.id")
      .leftJoin("provinsi", "bawaslu.provinsi_id", "provinsi.id")
      .modify((builder) => conditionFilterUser(builder, req.session.user))
      .orderBy("bawaslu.level_bawaslu")
      .whereNull("admin.deleted_at");

    res.json(result);
  })
  .post(async (req, res) => {
    const {
      level_bawaslu,
      nama_admin,
      telp_admin,
      email_admin,
      alamat_admin,
      username,
      password,
    } = req.body;
    var bawaslu_id;
    var provinsi_id = req.body.provinsi_id;
    var kabkota_id = req.body.kabkota_id;
    var nama_bawaslu;

    // validasi (double cek)
    if (level_bawaslu == 1) {
      var bawaslu_id = 0;
    }
    if (level_bawaslu === 2) {
      if (!provinsi_id)
        return res.status(400).json({
          message: "Provinsi Harus Diisi",
          type: "error",
        });
      var bawaslu_id = provinsi_id;
    }
    if (level_bawaslu === 3) {
      if (!kabkota_id)
        return res
          .status(400)
          .json({ message: "Kabupaten/Kota Harus Diisi", type: "error" });
      var bawaslu_id = kabkota_id;
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

    // AMBIL NAMA KABUPATEN/PROVINSI UNTUK DATA BAWASLU
    if (level_bawaslu == 1) {
      var nama_bawaslu = "Bawaslu Republik Indonesia";
    }
    if (level_bawaslu == 2) {
      const getNamaBawaslu = await db
        .select("provinsi")
        .from("provinsi")
        .where("id", bawaslu_id)
        .first();
      var nama_bawaslu = capitalizeFirstLetter(
        "Bawaslu " + getNamaBawaslu.provinsi
      );
    }
    if (level_bawaslu == 3) {
      const getNamaBawaslu = await db
        .select("kabkota")
        .from("kabkota")
        .where("id", bawaslu_id)
        .first();
      var nama_bawaslu = capitalizeFirstLetter(
        "Bawaslu " + getNamaBawaslu.kabkota
      );
    }

    // proses insert data bawaslu jika belum ada
    const cekDataBawaslu = await db("bawaslu").where("id", bawaslu_id).first();
    if (!cekDataBawaslu) {
      const insertDataBawaslu = await db("bawaslu").insert([
        {
          id: bawaslu_id,
          provinsi_id: provinsi_id,
          level_bawaslu: level_bawaslu,
          nama_bawaslu,
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
        bawaslu_id,
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
    const proses = await db("admin").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Menghapus Data", type: "success" });
  });
