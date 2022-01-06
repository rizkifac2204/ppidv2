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
        "tbl_permohonan_offline.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten"
      )
      .from("tbl_permohonan_offline")
      .leftJoin(
        "tbl_provinsi",
        "tbl_permohonan_offline.id_will",
        "tbl_provinsi.id"
      )
      .leftJoin(
        "tbl_kabupaten",
        "tbl_permohonan_offline.id_will",
        "tbl_kabupaten.id"
      )
      .modify((builder) =>
        conditionWillSpesific(
          db,
          builder,
          req.session.user,
          "tbl_permohonan_offline"
        )
      )
      .whereNull("tbl_permohonan_offline.deleted_at")
      .orderBy("tbl_permohonan_offline.tanggal", "desc");

    res.json(result);
  })
  .post(async (req, res) => {
    const { level, id_prov, id_kabkot } = req.session.user;
    const {
      nama,
      email,
      telp,
      pekerjaan,
      alamat,
      identitas,
      identitas_jenis,
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
      reg_number,
      tanggal,
      status,
      alasan,
    } = req.body;

    // cek reg number sama
    const cek = await db("tbl_permohonan_offline")
      .where("reg_number", reg_number)
      .first();

    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message:
          "Nomor Registrasi yang anda masukan sudah terdaftar dalam sistem, silakan masukan nomor register pengganti",
      });

    // proses simpan
    const proses = await db("tbl_permohonan_offline").insert([
      {
        nama,
        identitas,
        identitas_jenis,
        email,
        telp,
        pekerjaan,
        alamat,
        rincian,
        tujuan,
        cara_terima,
        cara_dapat,
        reg_number,
        tanggal,
        status,
        alasan,
        kepada: labelKepada(level),
        id_will: createWill(level, id_prov, id_kabkot),
      },
    ]);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // success
    res.json({ message: "Berhasil Menginput Data", type: "success" });
  });
