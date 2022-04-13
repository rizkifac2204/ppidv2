import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionWillSpesific,
  buatTiketByAdmin,
  labelKepada,
  createWill,
} from "middlewares/Condition";

export default Handler()
  .get(async (req, res) => {
    const result = await db
      .select(
        "permohonan.*",
        "pemohon.*",
        "bawaslu.nama_bawaslu",
        "bawaslu.level_bawaslu",
        "provinsi.provinsi"
      )
      .from("permohonan")
      .innerJoin("bawaslu", "permohonan.bawaslu_id", "bawaslu.id")
      .innerJoin("pemohon", "pemohon.email_pemohon", "permohonan.email_pemohon")
      .leftJoin("provinsi", "provinsi.id", "bawaslu.provinsi_id")
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "permohonan")
      )
      .whereNull("permohonan.deleted_at")
      .orderBy("permohonan.created_at", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { level, bawaslu_id } = req.session.user;
    const {
      no_registrasi,
      tanggal_permohonan,
      platform,
      nama_pemohon,
      pekerjaan_pemohon,
      pendidikan_pemohon,
      telp_pemohon,
      email_pemohon,
      alamat_pemohon,
      rincian,
      tujuan,
      cara_dapat,
      cara_terima,
      status_permohonan,
      jenis_respon,
      penguasaan_informasi,
      penguasaan_informasi_lain,
      penjelasan_penghitaman,
      jangka_waktu,
      // diberikan
      bentuk_fisik,
      ket_biaya,
      // ditolak
      dasar_pengecualian,
      pada_pasal,
      ket_konsekuensi,
    } = req.body;
    const tiket = buatTiketByAdmin(6, level, bawaslu_id);
    const badan_publik =
      penguasaan_informasi === "Bawaslu"
        ? penguasaan_informasi
        : penguasaan_informasi_lain;

    // cek reg number sama
    const cek = await db("permohonan")
      .where("no_registrasi", no_registrasi)
      .first();
    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message:
          "Nomor Registrasi yang anda masukan sudah terdaftar dalam sistem, silakan masukan nomor register pengganti",
      });

    // proses manajemen data pemohon
    const cekDataPemohon = await db("pemohon")
      .where({ email_pemohon: email_pemohon })
      .first();
    if (cekDataPemohon) {
      // proses update
      const update = await db("pemohon")
        .where({ email_pemohon: email_pemohon })
        .update({
          nama_pemohon,
          telp_pemohon,
          pekerjaan_pemohon,
          pendidikan_pemohon,
          alamat_pemohon,
        });

      // failed
      if (!update)
        return res.status(400).json({
          message: "Gagal Proses Input Pemohon",
        });
    } else {
      // proses simpan
      const simpan = await db("pemohon").insert({
        email_pemohon,
        nama_pemohon,
        telp_pemohon,
        pendidikan_pemohon,
        pekerjaan_pemohon,
        alamat_pemohon,
      });

      // failed
      if (!simpan)
        return res.status(400).json({
          message: "Gagal Menyimpan Data Pemohon",
        });
    }

    // proses simpan permohonan
    const dataForInsertPermohonan = {
      bawaslu_id,
      email_pemohon,
      tiket,
      no_registrasi,
      tanggal_permohonan,
      platform,
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
      status_permohonan,
    };
    const prosesInsertPermohonan = await db("permohonan").insert(
      dataForInsertPermohonan
    );

    // failed
    if (!prosesInsertPermohonan)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // proses simpan Respon
    const dataForInsertRespon = {
      permohonan_id: prosesInsertPermohonan,
      jenis_respon,
      penguasaan_informasi: badan_publik,
      bentuk_fisik: status_permohonan === "Ditolak" ? "" : bentuk_fisik,
      ket_biaya: status_permohonan === "Ditolak" ? "" : ket_biaya,
      penjelasan_penghitaman,
      jangka_waktu,
      mailed: false,
    };
    const prosesInsertRespon = await db("permohonan_respon").insert(
      dataForInsertRespon
    );

    // failed
    if (!prosesInsertRespon) {
      await db("permohonan").where("id", prosesInsertPermohonan).del();
      return res.status(400).json({ message: "Gagal Menginput Response" });
    }

    // cek apakah ditolak, kalau iya insert ke tabel penolakan
    if (status_permohonan === "Ditolak") {
      const insertTolak = await db("permohonan_respon_tolak").insert({
        respon_id: prosesInsertRespon,
        dasar_pengecualian,
        pada_pasal,
        ket_konsekuensi,
      });

      // failed
      if (!insertTolak) {
        await db("permohonan_respon").where("id", prosesInsertRespon).del();
        return res
          .status(400)
          .json({ message: "Gagal Menginput Response Penolakan" });
      }
    }

    // success
    res.json({ message: "Berhasil Menginput Data", type: "success" });
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("permohonan")
      .whereIn("id", arrID)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Memindahkan Ke Sampah", type: "success" });
  });
