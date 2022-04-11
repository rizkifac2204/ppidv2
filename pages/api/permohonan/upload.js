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
    const { id, kolom } = req.body;
    const { filename } = req.file;

    const updateFileResponse = await db("permohonan_respon")
      .where("id", id)
      .update({
        [kolom]: filename,
      });

    // failed
    if (!updateFileResponse) {
      DeleteUpload("./public/" + req.headers.destinationfile, req.file);
      return res.status(400).json({ message: "Gagal Upload" });
    }

    res.json({ file: filename, message: "Berhasil Upload" });
  })
  .delete(async (req, res) => {
    const update = await db("permohonan_respon")
      .where("id", req.query.id)
      .update({
        [req.query.namaFile]: null,
      });

    if (!update) {
      return res.status(400).json({ message: "Gagal Memproses Data" });
    }
    DeleteUpload("./public/" + req.query.path, req.query.file);
    res.json({ message: "Berhasil Hapus" });
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
