import db from "libs/db";
import Handler from "middlewares/Handler";
import { Upload, DeleteUpload } from "services/UploadService";

export default Handler()
  .post(Upload().single("file"), async (req, res) => {
    // jika sukses upload, maka file akan terdeteksi
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "File Tidak Sesuai Ketentuan", type: "error" });
    }

    // dapatkan body untuk tabel
    const { id_permohonan } = req.body;
    const { filename } = req.file;

    if (req.headers.destinationfile === "response") {
      // cek sudah ada response apa belum
      const cekExist = await db("tbl_permohonan_response")
        .where("id_permohonan", id_permohonan)
        .first();

      // Jika ada yang sama edit, jika belum insert
      if (cekExist) {
        const update = await db("tbl_permohonan_response")
          .where("id_permohonan", id_permohonan)
          .update({
            file: filename,
          });

        // failed
        if (!update) {
          DeleteUpload("./public/response", req.file);
          return res.status(400).json({ message: "Gagal Memproses Data" });
        }
      } else {
        const insert = await db("tbl_permohonan_response").insert({
          id_permohonan,
          file: filename,
        });

        // failed
        if (!insert) {
          DeleteUpload("./public/response", req.file);
          return res.status(400).json({ message: "Gagal Memproses Data" });
        }
      }
    } else {
      const update = await db("tbl_permohonan_offline")
        .where("id", id_permohonan)
        .update({
          file: filename,
        });

      // failed
      if (!update) {
        DeleteUpload("./public/offline", req.file);
        return res.status(400).json({ message: "Gagal Memproses Data" });
      }
    }

    res.json({ message: "Berhasil Upload" });
  })
  .delete(async (req, res) => {
    if (req.query.path === "response") {
      const update = await db("tbl_permohonan_response")
        .where("id_permohonan", req.query.id)
        .update({
          file: null,
        });

      if (!update) {
        return res.status(400).json({ message: "Gagal Memproses Data" });
      }
      DeleteUpload("./public/response", req.query.file);
    } else {
      const update = await db("tbl_permohonan_offline")
        .where("id", req.query.id)
        .update({
          file: null,
        });

      if (!update) {
        return res.status(400).json({ message: "Gagal Memproses Data" });
      }
      DeleteUpload("./public/offline", req.query.file);
    }
    res.json({ message: "Berhasil Hapus" });
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
