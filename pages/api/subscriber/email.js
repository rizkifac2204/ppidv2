import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionWillSpesific,
  labelKepada,
  createWill,
} from "middlewares/Condition";
import sendingMail, { mailOption, TextPerubahanStatus } from "services/Email";

async function kirim(setMailOption, id) {
  await sendingMail(setMailOption).then(async (resolve) => {
    if (!resolve) {
      // ubah email tidak terkirim jika gagal
      await db("tbl_email_send").where("id", id).update({
        status: 0,
        sended_at: null,
      });
      return res.json({
        message: "Gagal Kirim, Memidahkan Ke Draft",
        type: "info",
      });
    }
  });
}

export default Handler()
  .get(async (req, res) => {
    const { status } = req.query;
    const result = await db
      .select(
        "tbl_email_send.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_email_send")
      .leftJoin("tbl_provinsi", "tbl_email_send.id_will", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_email_send.id_will", "tbl_kabupaten.id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_email_send")
      )
      .modify((builder) => {
        if (status) builder.where("tbl_email_send.status", status);
      })
      .orderBy("tbl_email_send.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { level, id_prov, id_kabkot } = req.session.user;
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
      const getIDSubscriber = await db("tbl_email_subscribe")
        .select("id")
        .whereIn("email", listEmailPenerima);
      getIDSubscriber.map((item) => {
        listIDPenerima.push(item.id);
      });
    } else {
      // klo bukan select, maka langsung listIDPenerima null
      listIDPenerima = [];
      // dan buat list email untuk kirim
      const getEmailSubscriber = await db
        .select("email")
        .from("tbl_email_subscribe")
        .modify((builder) => {
          if (req.session.user.level <= 2) {
            builder.where(`id_will`, "=", 0);
          }
          if (req.session.user.level === 3) {
            builder.where(`id_will`, "=", id_prov);
          }
          if (req.session.user.level === 4) {
            builder.where(`id_will`, "=", id_kabkot);
          }
        });
      getEmailSubscriber.map((item) => {
        listEmailPenerima.push(item.email);
      });
    }

    // setting email
    const setMailOption = mailOption(listEmailPenerima, subjek, isi);

    if (id) {
      // proses Edit
      const proses = await db("tbl_email_send")
        .where("id", id)
        .update({
          oleh: labelKepada(level),
          id_will: createWill(level, id_prov, id_kabkot),
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
      if (send) kirim(setMailOption, id);

      // success
      return res.json({ message: "Berhasil Update Data", type: "success" });
    } else {
      // proses simpan
      const proses = await db("tbl_email_send").insert([
        {
          oleh: labelKepada(level),
          id_will: createWill(level, id_prov, id_kabkot),
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
      if (send) kirim(setMailOption, proses[0]);

      // success
      return res.json({ message: "Berhasil Insert Data", type: "success" });
    }
  })
  // delete one by one
  .put(async (req, res) => {
    const { id } = req.body;
    const proses = await db("tbl_email_send").where("id", id).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Berhasil Hapus", type: "success" });
  })
  // proses hapus data terpilih
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_email_send").whereIn("id", arrID).del();

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Sukses Menghapus Data Terpilih", type: "success" });
  });
