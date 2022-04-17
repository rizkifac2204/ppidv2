import db from "libs/db";
import Handler from "middlewares/Handler";

export default Handler()
  .get(async (req, res) => {
    const result = await db("divisi").orderBy("nama_divisi", "desc");
    res.json(result);
  })
  .post(async (req, res) => {
    const { nama_divisi } = req.body;

    const cek = await db
      .select("nama_divisi")
      .from("divisi")
      .where("nama_divisi", nama_divisi)
      .first();

    if (cek)
      return res.status(400).json({
        message: "Nama Divisi Sudah Terdaftar",
      });

    const simpan = await db("divisi").insert({
      nama_divisi,
    });

    // failed
    if (!simpan)
      return res.status(400).json({
        message: "Gagal Menyimpan Data",
      });

    // success
    res.json({ message: "Berhasil Menyimpan Data", type: "success" });
  })
  // delete one by one
  .delete(async (req, res) => {
    const { id } = req.body;

    try {
      const proses = await db("divisi").where("id", id).del();
      if (!proses) return res.status(400).json({ message: "Gagal Hapus" });
      res.json({ message: "Berhasil Hapus", type: "success" });
    } catch (err) {
      return res.status(400).json({
        message: "Gagal Proses, Data DIP terdeteksi",
      });
    }
  })
  // delete selected
  .put(async (req, res) => {
    const { data } = req.body;

    try {
      const proses = await db("divisi").whereIn("id", data).del();
      if (!proses) return res.status(400).json({ message: "Gagal Hapus" });
      res.json({ message: "Berhasil Hapus", type: "success" });
    } catch (err) {
      return res.status(400).json({
        message: "Gagal Proses, Data DIP terdeteksi",
      });
    }
  });
