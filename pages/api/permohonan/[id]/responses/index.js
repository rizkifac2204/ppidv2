import db from "libs/db";
import Handler from "middlewares/Handler";
import sendingMail, { mailOption, TextPerubahanStatus } from "services/Email";
import { buatCurTime } from "middlewares/PublicCondition";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const data = await db
      .select(
        `permohonan_respon.*`,
        `permohonan_respon_tolak.id as tolak_id`,
        `permohonan_respon_tolak.tanggal_ditolak`,
        `permohonan_respon_tolak.dasar_pengecualian`,
        `permohonan_respon_tolak.pada_pasal`,
        `permohonan_respon_tolak.ket_konsekuensi`
      )
      .from("permohonan_respon")
      .leftJoin(
        `permohonan_respon_tolak`,
        `permohonan_respon.id`,
        `permohonan_respon_tolak.respon_id`
      )
      .where({ permohonan_id: id });

    res.json(data);
  })
  .post(async (req, res) => {
    const {
      permohonan_id,
      email_pemohon,
      current_no_registrasi,
      no_registrasi,
      tiket,
      jenis_respon,
      status_permohonan,
      penguasaan_informasi,
      penguasaan_informasi_lain,
      penjelasan_penghitaman,
      jangka_waktu,
      pesan,
      mailed,
      // diberikan
      bentuk_fisik,
      ket_biaya,
      // ditolak
      dasar_pengecualian,
      pada_pasal,
      ket_konsekuensi,
    } = req.body;
    const tanggal = buatCurTime();
    const badan_publik =
      penguasaan_informasi === "Bawaslu"
        ? penguasaan_informasi
        : penguasaan_informasi_lain;

    // cek nomor registrasi sama
    const cekRegNumber = await db("permohonan")
      .where("no_registrasi", no_registrasi)
      .whereNot("id", permohonan_id)
      .first();

    // Jika ada yang sama
    if (cekRegNumber)
      return res.status(400).json({
        message:
          "Nomor Registrasi yang anda masukan sudah terdaftar dalam sistem, silakan masukan nomor register pengganti",
      });

    // proses update nomor registrasi jika terjadi perubahan
    if (current_no_registrasi != no_registrasi) {
      await db("permohonan")
        .where("id", permohonan_id)
        .update("no_registrasi", no_registrasi);
    }

    // proses update status permohonan terkait respon yang baru
    await db("permohonan")
      .where("id", permohonan_id)
      .update("status_permohonan", status_permohonan);

    const dataForInsertRespon = {
      permohonan_id,
      jenis_respon,
      tanggal_respon: tanggal,
      pesan,
      penguasaan_informasi: badan_publik,
      bentuk_fisik: status_permohonan === "Ditolak" ? "" : bentuk_fisik,
      ket_biaya: status_permohonan === "Ditolak" ? "" : ket_biaya,
      penjelasan_penghitaman,
      jangka_waktu,
      mailed,
    };
    // proses simpan respon
    const insert = await db("permohonan_respon").insert(dataForInsertRespon);

    // failed
    if (!insert)
      return res.status(400).json({ message: "Gagal Menginput Response" });

    // cek apakah ditolak, kalau iya insert ke tabel penolakan
    if (status_permohonan === "Ditolak") {
      const insertTolak = await db("permohonan_respon_tolak").insert({
        respon_id: insert,
        tanggal_ditolak: tanggal,
        dasar_pengecualian,
        pada_pasal,
        ket_konsekuensi,
      });

      // failed
      if (!insertTolak) {
        await db("permohonan_respon").where("id", insert).del();
        return res
          .status(400)
          .json({ message: "Gagal Menginput Response Penolakan" });
      }
    }

    // setting email
    const setMailOption = mailOption(
      email_pemohon,
      "Perubahan Status Permohonan Informasi",
      TextPerubahanStatus(
        tiket,
        email_pemohon,
        status_permohonan,
        no_registrasi,
        pesan
      )
    );

    // jika harus kirim email
    if (mailed) {
      await sendingMail(setMailOption).then(async (resolve) => {
        if (!resolve) {
          // ubah email tidak terkirim jika gagal
          await db("permohonan_respon").where("id", insert).update({
            mailed: 0,
          });
        }
      });
    }

    // data callback
    const dataCallback = {
      id: insert[0],
      permohonan_id,
      jenis_respon,
      tanggal_respon: tanggal,
      pesan,
      penguasaan_informasi: badan_publik,
      bentuk_fisik,
      ket_biaya,
      penjelasan_penghitaman,
      jangka_waktu,
      mailed,
      respon_id: insert,
      tanggal_ditolak: tanggal,
      dasar_pengecualian,
      pada_pasal,
      ket_konsekuensi,
    };

    // success
    res.json({
      message: "Berhasil Memproses Response",
      dataCallback,
      type: "success",
    });
  });
