import db from "libs/db";
import nextConnect from "next-connect";

const handler = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.toString(), type: "error" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ message: "Not found", type: "error" });
  },
}).get(async (req, res) => {
  const { id } = req.query;
  const data = await db
    .from("bawaslu")
    .select("bawaslu.*", "admin.nama_admin")
    .innerJoin("admin", function () {
      this.on("bawaslu.id", "=", "admin.bawaslu_id");
    })
    .where("bawaslu.id", id)
    .first();

  if (!data)
    return res.json({
      email: "Tidak Ditemukan",
      telp: "Tidak Ditemukan",
      kota: "Tidak Ditemukan",
      alamat: "Tidak Ditemukan",
      nama: "Tidak Ditemukan",
    });

  res.json(data);
});

export default handler;
