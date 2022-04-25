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
import * as fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default PublicHandler().post(
  UploadPublic().single("file"),
  async (req, res) => {
    // jika tidak ada identitas
    if (!req.file && !req.body.identitas_pemohon) {
      return res.status(400).json({
        message: "File Identitas Tidak Ditemukan atau Tidak Sesuai",
        type: "error",
      });
    }
    // jika tidak upload ulang, cek apakah filenya masih ada
    if (!req.file && req.body.identitas_pemohon) {
      if (!fs.existsSync("./public/upload/" + req.body.identitas_pemohon))
        return res.status(400).json({
          message: "File identitas Harus Upload Ulang",
          type: "error",
        });
    }

    const filename = req.file ? req.file.filename : req.body.identitas_pemohon;
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

    // setting email untuk admin dan pemohon
    const getEmailBawaslu = await db("bawaslu").where("id", bawaslu_id).first();
    const setMailOptionPemohon = mailOption(
      email_pemohon,
      "Permohonan Informasi PPID Bawaslu",
      TextPermohonanBaruKepadaPemohon(tiket, email_pemohon)
    );
    const setMailOptionAdmin = mailOption(
      getEmailBawaslu.email_bawaslu
        ? getEmailBawaslu.email_bawaslu
        : "rizkifac2204@gmail.com",
      "Permohonan Informasi Baru",
      TextPermohonanBaruKepadaAdmin(tiket, email_pemohon)
    );

    // proses simpan data pemohon
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
          identitas_pemohon: filename,
        });
      // failed
      if (!update) {
        // gagal update hapus file baru
        if (req.file) {
          DeleteUpload("./public/upload", req.file);
        }
        return res.status(400).json({
          message: "Gagal Proses Input Pemohon",
        });
      }
      // berhasil update hapus file lama jika upload
      if (req.file) {
        DeleteUpload("./public/upload", cekDataPemohon.identitas_pemohon);
      }
    } else {
      // proses simpan
      const simpan = await db("pemohon").insert(dataForInsertPemohon);
      // failed
      if (!simpan) {
        // batal simpan
        if (req.file) {
          DeleteUpload("./public/upload", req.file);
        }
        return res.status(400).json({
          message: "Gagal Menyimpan Data Pemohon",
        });
      }
    }

    // prepare data for callback
    const currentData = {
      ...dataForInsertPermohonan,
      ...dataForInsertPemohon,
    };
    // proses simpan
    try {
      const proses = await db("permohonan").insert(dataForInsertPermohonan);
      // failed
      if (!proses) {
        return res.status(400).json({
          message: "Gagal Mengirim Permohonan",
        });
      }
      // await sendingMail(setMailOptionPemohon);
      // await sendingMail(setMailOptionAdmin);

      // success
      res.json({
        message: "Berhasil Mengirim Permohonan",
        currentData,
        type: "success",
      });
    } catch (err) {
      return res.status(400).json({
        currentData,
        message: "Gagal Mengirim Permohonan Informasi",
      });
    }
  }
);
