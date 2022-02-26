import db from "libs/db";
import nextConnect from "next-connect";
import { UploadPublic, DeleteUpload } from "services/UploadService";
import {
  buatTiket,
  buatCurTime,
  buatIDWill,
} from "middlewares/PublicCondition";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.toString(), type: "error" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ message: "Not found", type: "error" });
  },
}).post(UploadPublic().single("file"), async (req, res) => {
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
  const tiket = buatTiket(6, kepada, id_prov, id_kabkot);
  const curtime = buatCurTime();
  const id_will = buatIDWill(kepada, id_prov, id_kabkot);

  const dataForInsert = {
    kepada,
    tiket_number: tiket,
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

  DeleteUpload("./public/upload", req.file);
  res.json({
    message: "Berhasil Mengirim Permohonan",
    currentData: dataForInsert,
    type: "success",
  });

  // // proses simpan
  // try {
  //   const proses = await db("tbl_permohonan").insert([dataForInsert]);

  //   // failed
  //   if (!proses) {
  //     DeleteUpload("./public/upload", req.file);
  //     return res.status(400).json({
  //       message: "Gagal Mengirim Permohonan",
  //     });
  //   }

  //   // success
  //   res.json({
  //     message: "Berhasil Mengirim Permohonan",
  //     currentData: dataForInsert,
  //     type: "success",
  //   });
  // } catch (err) {
  //   DeleteUpload("./public/upload", req.file);
  //   return res.status(400).json({
  //     message: "Gagal Mengirim Permohonan 2",
  //   });
  // }
});

export default handler;
