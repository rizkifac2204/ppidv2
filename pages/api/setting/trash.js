import db from "libs/db";
import Handler from "middlewares/Handler";
import { conditionWillSpesific } from "middlewares/Condition";
import { DeleteUpload } from "services/UploadService";

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
      .whereNotNull("permohonan.deleted_at")
      .orderBy("permohonan.created_at", "desc");

    res.json(result);
  })
  .put(async (req, res) => {
    const { id } = req.body;

    // proses
    const proses = await db("permohonan")
      .where("id", id)
      .update("deleted_at", null);

    // failed
    if (!proses)
      return res.status(400).json({
        message: "Gagal Proses Data",
      });

    // success
    res.json({ message: "Berhasil Mengembalikan Data", type: "success" });
  })
  // delete one by one
  .post(async (req, res) => {
    const { id } = req.body;

    const cek = await db
      .select("file_surat_pemberitahuan", "file_informasi")
      .from("permohonan_respon")
      .where("permohonan_id", id);

    const fileIndormasis = cek.map(function (value) {
      return value.file_informasi;
    });
    const fileSuratPemberitahuans = cek.map(function (value) {
      return value.file_surat_pemberitahuan;
    });

    // proses
    try {
      const proses = await db("permohonan").where("id", id).del();

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Hapus Data",
        });

      // Hapus semua file
      DeleteUpload("./public/response", fileIndormasis);
      DeleteUpload("./public/pemberitahuan", fileSuratPemberitahuans);

      // success
      res.json({ message: "Berhasil Hapus Data", type: "success" });
    } catch (err) {
      return res.status(400).json({
        message: "Gagal Hapus Permohonan Informasi",
      });
    }
  })
  // delete selected
  .delete(async (req, res) => {
    const { id } = req.body;

    // get detail untuk ambil nama file surat pemberitahuan dan file response
    const cek = await db
      .select("file_surat_pemberitahuan", "file_informasi")
      .from("permohonan_respon")
      .whereIn("permohonan_id", id);

    const fileIndormasis = cek.map(function (value) {
      return value.file_informasi;
    });
    const fileSuratPemberitahuans = cek.map(function (value) {
      return value.file_surat_pemberitahuan;
    });

    // proses
    try {
      const proses = await db("permohonan").whereIn("id", id).del();

      // failed
      if (!proses)
        return res.status(400).json({
          message: "Gagal Hapus Data",
        });

      // Hapus semua file
      DeleteUpload("./public/response", fileIndormasis);
      DeleteUpload("./public/pemberitahuan", fileSuratPemberitahuans);

      // success
      res.json({ message: "Berhasil Hapus Data", type: "success" });
    } catch (err) {
      return res.status(400).json({
        message: "Gagal Hapus Permohonan Informasi",
      });
    }
  });
