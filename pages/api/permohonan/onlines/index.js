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
        "tbl_permohonan.*",
        "tbl_provinsi.provinsi",
        "tbl_kabupaten.kabupaten",
        "tbl_permohonan_response.status",
        "tbl_permohonan_response.alasan",
        "tbl_permohonan_response.waktu",
        "tbl_permohonan_response.response",
        "tbl_permohonan_response.file"
      )
      .from("tbl_permohonan")
      .leftJoin("tbl_provinsi", "tbl_permohonan.id_will", "tbl_provinsi.id")
      .leftJoin("tbl_kabupaten", "tbl_permohonan.id_will", "tbl_kabupaten.id")
      .leftJoin(
        "tbl_permohonan_response",
        "tbl_permohonan.id",
        "tbl_permohonan_response.id_permohonan"
      )
      .modify((builder) =>
        conditionWillSpesific(db, builder, req.session.user, "tbl_permohonan")
      )
      .whereNull("tbl_permohonan.deleted_at")
      .orderBy("tbl_permohonan.created_at", "desc");

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
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
      reg_number,
      tanggal,
      status,
    } = req.body;
    var alasan = req.body.alasan;
    if (status !== "Diberikan Sebagian" || status === "Tidak Dapat Diberikan") {
      alasan = null;
    }

    // cek reg number sama
    const cek = await db("tbl_permohonan")
      .where("reg_number", reg_number)
      .first();

    // Jika ada yang sama
    if (cek)
      return res.status(400).json({
        message:
          "Nomor Registrasi yang anda masukan sudah terdaftar dalam sistem, silakan masukan nomor register pengganti",
      });

    // proses simpan
    const proses = await db("tbl_permohonan").insert([
      {
        nama,
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
        kepada: labelKepada(level),
        id_will: createWill(level, id_prov, id_kabkot),
      },
    ]);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Memasukan Data",
      });

    // proses simpan
    const prosesResponse = await db("tbl_permohonan_response").insert([
      {
        status,
        alasan,
        id_permohonan: proses,
      },
    ]);

    // success
    res.json({ message: "Berhasil Menginput Data", type: "success" });
  })
  .delete(async (req, res) => {
    const arrID = req.body;
    const proses = await db("tbl_permohonan")
      .whereIn("id", arrID)
      .update("deleted_at", db.fn.now());

    if (!proses) return res.status(400).json({ message: "Gagal Hapus" });

    res.json({ message: "Memindahkan Ke Sampah", type: "success" });
  });
