import db from "libs/db";
import PublicHandler from "middlewares/PublicHandler";
import { buatIDWill, buatCurTime } from "middlewares/PublicCondition";

export default PublicHandler().post(async (req, res) => {
  const {
    kepada,
    id_prov,
    id_kabkota,
    nama_pemohon,
    jenis_kelamin_pemohon,
    pendidikan_pemohon,
    email_pemohon,
    pekerjaan_pemohon,
    alamat_pemohon,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
    saran,
  } = req.body;
  const bawaslu_id = buatIDWill(kepada, id_prov, id_kabkota);
  const tanggal_survey = buatCurTime();

  const dataForInsertSurvey = {
    bawaslu_id,
    email_pemohon,
    tanggal_survey,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
    saran,
  };

  const dataForInsertPemohon = {
    email_pemohon,
    nama_pemohon,
    jenis_kelamin_pemohon,
    pekerjaan_pemohon,
    pendidikan_pemohon,
    alamat_pemohon,
  };

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
        pekerjaan_pemohon,
        jenis_kelamin_pemohon,
        pendidikan_pemohon,
        alamat_pemohon,
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
    const proses = await db("survey").insert(dataForInsertSurvey);

    // failed
    if (!proses) {
      return res.status(400).json({
        message: "Gagal Mengirim Survey",
      });
    }

    // success
    res.json({
      message: "Berhasil Mengirim Survey",
      type: "success",
    });
  } catch (err) {
    return res.status(400).json({
      message: "Gagal Mengirim Survey",
    });
  }
});
