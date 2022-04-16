import db from "libs/db";
import Handler from "middlewares/Handler";
// khusus subscriber instansi masing2

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select("subscriber.*", "bawaslu.nama_bawaslu")
      .from("subscriber")
      .leftJoin("bawaslu", "bawaslu.id", "subscriber.bawaslu_id")
      .modify((builder) => {
        if (req.session.user.level === 1) {
          builder.where(`subscriber.bawaslu_id`, "=", `0`);
        }
        if (req.session.user.level === 2) {
          builder.where(
            `subscriber.bawaslu_id`,
            "=",
            `${req.session.user.bawaslu_id}`
          );
        }
        if (req.session.user.level === 3) {
          builder.where(
            `subscriber.bawaslu_id`,
            "=",
            req.session.user.bawaslu_id
          );
        }
      })
      .orderBy("subscriber.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { bawaslu_id } = req.session.user;
    const { nama_subscriber, email_subscriber } = req.body;

    // proses simpan
    const proses = await db("subscriber").insert([
      {
        nama_subscriber,
        email_subscriber,
        bawaslu_id,
      },
    ]);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // success
    res.json({ message: "Berhasil Menginput Data", type: "success" });
  })
  // delete one by one
  .put(async (req, res) => {
    const { id } = req.body;
    const proses = await db("subscriber").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  })
  // proses hapus data terpilih
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("subscriber").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Sukses Menghapus Data Terpilih", type: "success" });
  });
