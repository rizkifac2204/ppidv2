import db from "libs/db";
import Handler from "middlewares/Handler";
import { createWill } from "middlewares/Condition";

const conditionForThis = (builder, user) => {
  if (user.level <= 2) {
    builder.where("id_wilayah", 0);
  }
  if (user.level === 3) {
    builder.where("id_wilayah", user.id_prov);
  }
  if (user.level === 4) {
    builder.where("id_wilayah", user.id_kabkot);
  }
};

export default Handler()
  .get(async (req, res) => {
    const data = await db("tbl_data_bawaslu")
      .modify((builder) => conditionForThis(builder, req.session.user))
      .first();
    res.json(data);
  })
  .post(async (req, res) => {
    const { level, id_prov, id_kabkot } = req.session.user;
    const id_wilayah = createWill(level, id_prov, id_kabkot);
    const { telp, alamat, kota, email, ppid, fb, tw, yt, ig } = req.body;

    const cek = await db("tbl_data_bawaslu")
      .modify((builder) => conditionForThis(builder, req.session.user))
      .first();

    if (cek) {
      // proses update
      const update = await db("tbl_data_bawaslu")
        .where("id_wilayah", id_wilayah)
        .update({
          telp,
          alamat,
          kota,
          email,
          ppid,
          fb,
          tw,
          yt,
          ig,
        });

      // failed
      if (!update)
        return res.status(400).json({
          message: "Gagal Mengubah Data",
        });

      // success
      res.json({ message: "Berhasil Menyimpan Data", type: "success" });
    } else {
      // proses simpan
      const simpan = await db("tbl_data_bawaslu").insert({
        id_wilayah,
        telp,
        alamat,
        kota,
        email,
        ppid,
        fb,
        tw,
        yt,
        ig,
      });

      // failed
      if (!simpan)
        return res.status(400).json({
          message: "Gagal Mengubah Data",
        });

      // success
      res.json({ message: "Berhasil Menyimpan Data", type: "success" });
    }
  });
