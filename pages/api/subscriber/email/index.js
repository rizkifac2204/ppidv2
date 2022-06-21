import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";
import sendingMail, { mailOption } from "services/Email";

async function kirim(send, setMailOption, id) {
  if (send) {
    await sendingMail(setMailOption).then(async (resolve) => {
      if (!resolve) {
        // ubah email tidak terkirim jika gagal
        await db("subscriber_email").where("id", id).update({
          status: 0,
          sended_at: null,
        });
        throw new Error("Email Tidak Terkirim, Menyimpan Ke Draft");
      }
    });
  }
}

export default Handler()
  .get(async (req, res) => {
    const { status } = req.query;
    const result = await db
      .select("subscriber_email.*", "bawaslu.nama_bawaslu")
      .from("subscriber_email")
      .leftJoin("bawaslu", "bawaslu.id", "subscriber_email.bawaslu_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "subscriber_email")
      )
      .modify((builder) => {
        if (status) builder.where("subscriber_email.status", status);
      })
      .orderBy("subscriber_email.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { level, bawaslu_id } = req.session.user;
    const { id, penerima, subjek, isi, send } = req.body;
    const sended_at = send ? new Date() : null;

    // persiapan value untuk kolom daftar penerima dan/atau list email
    var listIDPenerima = [];
    var listEmailPenerima = req.body.list_penerima;

    // cek siapa penerima
    // kalau select disiapkan List ID untuk kolom daftar_penerima
    // kalau all disiapkan List Email untuk kirim email
    if (penerima === "Select") {
      // klo select, cek kosong atau tidak
      if (listEmailPenerima.length === 0)
        return res.status(400).json({
          message: "Daftar Penerima Tidak Terdeteksi",
        });
      // jika ada, loop subscriber dan push id ke listIDPenerima
      const getIDSubscriber = await db("subscriber")
        .select("id")
        .whereIn("email_subscriber", listEmailPenerima);
      getIDSubscriber.map((item) => {
        listIDPenerima.push(item.id);
      });
    } else {
      // klo bukan select, maka langsung listIDPenerima null
      listIDPenerima = [];
      // dan buat list email untuk kirim
      const getEmailSubscriber = await db
        .select("email_subscriber")
        .from("subscriber")
        .modify((builder) => {
          if (req.session.user.level === 1) {
            builder.where(`bawaslu_id`, "=", 0);
          }
          if (req.session.user.level === 2) {
            builder.where(`bawaslu_id`, "=", bawaslu_id);
          }
          if (req.session.user.level === 3) {
            builder.where(`bawaslu_id`, "=", bawaslu_id);
          }
        });
      getEmailSubscriber.map((item) => {
        listEmailPenerima.push(item.email_subscriber);
      });
    }

    // setting email
    const setMailOption = mailOption(listEmailPenerima, subjek, isi);

    if (id) {
      // proses Edit
      const proses = await db("subscriber_email")
        .where("id", id)
        .update({
          bawaslu_id,
          penerima,
          daftar_penerima:
            listIDPenerima.length === 0 ? null : `${listIDPenerima}`,
          subjek,
          isi,
          status: send,
          sended_at,
        });

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Memproses Data",
        });

      // jika harus kirim email
      await kirim(send, setMailOption, id);
    } else {
      // proses simpan
      const proses = await db("subscriber_email").insert([
        {
          bawaslu_id,
          penerima,
          daftar_penerima:
            listIDPenerima.length === 0 ? null : `${listIDPenerima}`,
          subjek,
          isi,
          status: send,
          sended_at,
        },
      ]);

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Memproses Data",
        });

      // jika harus kirim email
      await kirim(send, setMailOption, proses[0]);
    }

    // success
    res.json({ message: "Berhasil Proses Data", type: "success" });
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("subscriber_email").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Sukses Menghapus Data Terpilih", type: "success" });
  });
