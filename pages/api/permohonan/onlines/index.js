import db from "libs/db";
import Handler from "middlewares/Handler";
import {
  conditionWillSpesific,
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
      email_pemohon,
      nama_pemohon,
      telp_pemohon,
      jenis_kelamin_pemohon,
      pendidikan_pemohon,
      pekerjaan_pemohon,
      alamat_pemohon,
      no_registrasi,
      rincian,
      tujuan,
      cara_dapat,
      cara_terima,
      tanggal_permohonan,
      status_permohonan,
    } = req.body;

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

    // manajemen data pemohon
    const cekPemohon = await db("pemohon")
      .where("email_pemohon", email_pemohon)
      .first();
    if (cekPemohon) {
      const insertDataPemohon = await db("pemohon").insert([
        {
          email_pemohon: email_pemohon,
          nama_pemohon: nama_pemohon,
          telp_pemohon: telp_pemohon,
          jenis_kelamin_pemohon: jenis_kelamin_pemohon,
          pendidikan_pemohon: pendidikan_pemohon,
          pekerjaan_pemohon: pekerjaan_pemohon,
          alamat_pemohon: alamat_pemohon,
        },
      ]);
      // failed
      if (!insertDataPemohon)
        return res.status(400).json({
          message: "Terjadi Kesalahan Sistem Memasukan Data Pemohon",
        });
    } else {
      const updateDataPemohon = await db("pemohon")
        .where("email_pemohon", email_pemohon)
        .update({
          nama_pemohon: nama_pemohon,
          telp_pemohon: telp_pemohon,
          jenis_kelamin_pemohon: jenis_kelamin_pemohon,
          pendidikan_pemohon: pendidikan_pemohon,
          pekerjaan_pemohon: pekerjaan_pemohon,
          alamat_pemohon: alamat_pemohon,
        });
      // failed
      if (!updateDataPemohon)
        return res.status(400).json({
          message: "Terjadi Kesalahan Sistem Mengubah Data Pemohon",
        });
    }

    // proses simpan permohonan
    const proses = await db("permohonan").insert([
      {
        bawaslu_id,
        email_pemohon,
        no_registrasi,
        tanggal_permohonan,
        platform: "Website",
        rincian,
        tujuan,
        cara_dapat,
        cara_terima,
        status_permohonan,
      },
    ]);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // // proses simpan
    // const prosesResponse = await db("tbl_permohonan_response").insert([
    //   {
    //     status,
    //     alasan,
    //     id_permohonan: proses,
    //   },
    // ]);

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
