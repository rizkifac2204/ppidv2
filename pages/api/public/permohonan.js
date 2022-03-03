import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";
import { UploadPublic, DeleteUpload } from "services/UploadService";
import {
  buatTiket,
  buatCurTime,
  buatIDWill,
} from "middlewares/PublicCondition";
import sendingMail, {
  mailOption,
  TextPermohonanBaruKepadaAdmin,
  TextPermohonanBaruKepadaPemohon,
} from "services/Email";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default PublicHandler().post(
  UploadPublic().single("file"),
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File Tidak Sesuai Ketentuan", type: "error" });
    }

    const { filename } = req.file;
    const {
      kepada,
      id_prov,
      id_kabkot,
      nama,
      email,
      telp,
      pekerjaan,
      alamat,
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
    } = req.body;
    const tiket_number = buatTiket(6, kepada, id_prov, id_kabkot);
    const curtime = buatCurTime();
    const id_will = buatIDWill(kepada, id_prov, id_kabkot);

    const dataForInsert = {
      kepada,
      tiket_number,
      nama,
      email,
      telp,
      pekerjaan,
      alamat,
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
      tanggal: curtime,
      id_will: id_will,
      ktp: filename,
    };

    const getEmailBawaslu = await db("tbl_data_bawaslu")
      .where("id_wilayah", id_will)
      .first();

    // setting email untuk admin dan pemohon
    const setMailOptionPemohon = mailOption(
      email,
      "Permohonan Informasi PPID Bawaslu",
      TextPermohonanBaruKepadaPemohon(tiket_number, email)
    );
    const setMailOptionAdmin = mailOption(
      getEmailBawaslu.email,
      "Permohonan Informasi Baru",
      TextPermohonanBaruKepadaAdmin(tiket_number, email)
    );

    // proses simpan
    try {
      const proses = await db("tbl_permohonan").insert([dataForInsert]);

      // failed
      if (!proses) {
        DeleteUpload("./public/upload", req.file);
        return res.status(400).json({
          message: "Gagal Mengirim Permohonan",
        });
      }

      await sendingMail(setMailOptionPemohon);
      await sendingMail(setMailOptionAdmin);

      // success
      res.json({
        message: "Berhasil Mengirim Permohonan",
        currentData: dataForInsert,
        type: "success",
      });
    } catch (err) {
      DeleteUpload("./public/upload", req.file);
      return res.status(400).json({
        message: "Gagal Mengirim Permohonan Informasi",
      });
    }
  }
);
