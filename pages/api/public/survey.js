import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";
import { buatIDWill } from "middlewares/PublicCondition";

export default PublicHandler().post(async (req, res) => {
  const {
    kepada,
    id_prov,
    id_kabkot,
    nama,
    jenis_kelamin,
    pendidikan,
    email,
    pekerjaan,
    alamat,
    satu,
    dua,
    tiga,
    empat,
    lima,
    enam,
    tujuh,
    delapan,
    sembilan,
    sepuluh,
    saran,
  } = req.body;
  const id_will = buatIDWill(kepada, id_prov, id_kabkot);

  const dataForInsert = {
    kepada,
    id_will: id_will,
    nama,
    jenis_kelamin,
    pendidikan,
    email,
    pekerjaan,
    alamat,
    satu,
    dua,
    tiga,
    empat,
    lima,
    enam,
    tujuh,
    delapan,
    sembilan,
    sepuluh,
    saran,
  };

  // proses simpan
  try {
    const proses = await db("tbl_survey").insert([dataForInsert]);

    // failed
    if (!proses) {
      return res.status(400).json({
        message: "Gagal Mengirim Survey",
      });
    }

    // success
    res.json({
      message: "Berhasil Mengirim Survey",
      currentData: dataForInsert,
      type: "success",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Gagal Mengirim Survey",
    });
  }
});
