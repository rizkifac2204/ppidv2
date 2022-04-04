import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";
import sendingMail, {
  mailOption,
  TextKeberatanKepadaAdmin,
  TextKeberatanKepadaPemohon,
} from "services/Email";
import { buatCurTime } from "middlewares/PublicCondition";

export default PublicHandler()
  .get(async (req, res) => {
    const { reg_number } = req.query;

    const data = await db
      .select(
        "permohonan.*",
        "permohonan_respon.pesan",
        "permohonan_respon.file_informasi",
        "bawaslu.*",
        "pemohon.nama_pemohon",
        "pemohon.alamat_pemohon"
      )
      .from("permohonan")
      .innerJoin("pemohon", "pemohon.email_pemohon", "permohonan.email_pemohon")
      .leftJoin("bawaslu", "bawaslu.id", "permohonan.bawaslu_id")
      .leftJoin(
        "permohonan_respon",
        "permohonan.id",
        "permohonan_respon.permohonan_id"
      )
      .whereNull("permohonan.deleted_at")
      .andWhere("permohonan.no_registrasi", reg_number)
      .first();

    if (!data) return res.status(404).json({ message: "Tidak Ditemukan" });
    res.json(data);
  })
  .post(async (req, res) => {
    const {
      id,
      reg_number,
      id_will,
      email,
      alasan_a,
      alasan_b,
      alasan_c,
      alasan_d,
      alasan_e,
      alasan_f,
      alasan_g,
      kasus,
    } = req.body;
    const curtime = buatCurTime();

    const getEmailBawaslu = await db("tbl_data_bawaslu")
      .where("id_wilayah", id_will)
      .first();

    // setting email untuk admin dan pemohon
    const setMailOptionPemohon = mailOption(
      email,
      "Pengajuan Keberatan PPID Bawaslu",
      TextKeberatanKepadaPemohon(reg_number)
    );
    const setMailOptionAdmin = mailOption(
      getEmailBawaslu.email,
      "Pengajuan Keberatan Permohonan Informasi Baru",
      TextKeberatanKepadaAdmin(reg_number, email)
    );

    const dataForInsert = {
      id_permohonan: id,
      alasan_a: alasan_a ? 1 : 0,
      alasan_b: alasan_b ? 1 : 0,
      alasan_c: alasan_c ? 1 : 0,
      alasan_d: alasan_d ? 1 : 0,
      alasan_e: alasan_e ? 1 : 0,
      alasan_f: alasan_f ? 1 : 0,
      alasan_g: alasan_g ? 1 : 0,
      kasus,
      tanggal: curtime,
    };

    // proses simpan
    try {
      const proses = await db("tbl_permohonan_keberatan").insert([
        dataForInsert,
      ]);

      // failed
      if (!proses) {
        return res.status(400).json({
          message: "Gagal Mengajukan Keberatan",
        });
      }

      await sendingMail(setMailOptionPemohon);
      await sendingMail(setMailOptionAdmin);

      // success
      res.json({
        message: "Berhasil Mengajukan Keberatan",
        currentData: dataForInsert,
        type: "success",
      });
    } catch (err) {
      return res.status(400).json({
        message: "Gagal Mengajukan Keberatan",
      });
    }
  });
