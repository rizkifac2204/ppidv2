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
      id_kabkota,
      email_pemohon,
      nama_pemohon,
      telp_pemohon,
      pekerjaan_pemohon,
      pendidikan_pemohon,
      alamat_pemohon,
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
    } = req.body;
    const platform = "Website";
    const status_permohonan = "Proses";
    const tiket = buatTiket(6, kepada, id_prov, id_kabkota);
    const tanggal_permohonan = buatCurTime();
    const bawaslu_id = buatIDWill(kepada, id_prov, id_kabkota);

    const dataForInsertPermohonan = {
      bawaslu_id,
      email_pemohon,
      tiket,
      tanggal_permohonan,
      platform,
      rincian,
      tujuan,
      cara_terima,
      cara_dapat,
      status_permohonan,
    };

    const dataForInsertPemohon = {
      email_pemohon,
      nama_pemohon,
      telp_pemohon,
      pekerjaan_pemohon,
      pendidikan_pemohon,
      alamat_pemohon,
      identitas_pemohon: filename,
    };

    const getEmailBawaslu = await db("bawaslu").where("id", bawaslu_id).first();

    // setting email untuk admin dan pemohon
    const setMailOptionPemohon = mailOption(
      email_pemohon,
      "Permohonan Informasi PPID Bawaslu",
      TextPermohonanBaruKepadaPemohon(tiket, email_pemohon)
    );
    const setMailOptionAdmin = mailOption(
      getEmailBawaslu.email_bawaslu,
      "Permohonan Informasi Baru",
      TextPermohonanBaruKepadaAdmin(tiket, email_pemohon)
    );

    // proses simpan data pemohon
    const cekDataPemohon = await db("pemohon")
      .where({ email_pemohon: email_pemohon })
      .first();
    if (cekDataPemohon) {
      // ganti dengan file yang baru
      DeleteUpload("./public/upload", cekDataPemohon.identitas_pemohon);
      // proses update
      const update = await db("pemohon")
        .where({ email_pemohon: email_pemohon })
        .update({
          nama_pemohon,
          telp_pemohon,
          pekerjaan_pemohon,
          pendidikan_pemohon,
          alamat_pemohon,
          identitas_pemohon: filename,
        });

      // failed
      if (!update)
        return res.status(400).json({
          message: "Gagal Proses Input Pemohon",
        });
    } else {
      // proses simpan
      const simpan = await db("pemohon").insert(dataForInsertPemohon);

      // failed
      if (!simpan)
        return res.status(400).json({
          message: "Gagal Menyimpan Data Pemohon",
        });
    }

    // proses simpan
    try {
      const proses = await db("permohonan").insert(dataForInsertPermohonan);

      // failed
      if (!proses) {
        DeleteUpload("./public/upload", req.file);
        return res.status(400).json({
          message: "Gagal Mengirim Permohonan",
        });
      }

      await sendingMail(setMailOptionPemohon);
      await sendingMail(setMailOptionAdmin);

      const currentData = {
        ...dataForInsertPermohonan,
        ...dataForInsertPemohon,
      };

      // success
      res.json({
        message: "Berhasil Mengirim Permohonan",
        currentData,
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
