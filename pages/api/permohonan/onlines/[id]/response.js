import db from "libs/db";
import Handler from "middlewares/Handler";
import sendingMail, { mailOption, TextPerubahanStatus } from "services/Email";

export default Handler()
  .get(async (req, res) => {
    const { id } = req.query;
    const data = await db
      .from("tbl_permohonan_response")
      .where({ id_permohonan: id })
      .first();

    res.json(data);
  })
  .post(async (req, res) => {
    const {
      id,
      id_permohonan,
      current_reg_number,
      reg_number,
      response,
      status,
      waktu,
      mailed,
      email,
      tiket_number,
    } = req.body;
    var alasan = req.body.alasan;
    if (status !== "Diberikan Sebagian" || status === "Tidak Dapat Diberikan") {
      alasan = null;
    }

    // cek reg number sama
    const cekRegNumber = await db("tbl_permohonan")
      .where("reg_number", reg_number)
      .whereNot("id", id_permohonan)
      .first();

    // Jika ada yang sama
    if (cekRegNumber)
      return res.status(400).json({
        message:
          "Nomor Registrasi yang anda masukan sudah terdaftar dalam sistem, silakan masukan nomor register pengganti",
      });

    // proses update reg number
    if (current_reg_number != reg_number) {
      await db("tbl_permohonan")
        .where("id", id_permohonan)
        .update("reg_number", reg_number);
    }

    // cek sudah ada response apa belum
    const cekExist = await db("tbl_permohonan_response")
      .where("id_permohonan", id_permohonan)
      .first();

    // Jika ada yang sama edit, jika belum insert
    if (cekExist) {
      const update = await db("tbl_permohonan_response")
        .where("id_permohonan", id_permohonan)
        .update({
          status,
          alasan,
          waktu,
          response,
          mailed,
        });

      // failed
      if (!update)
        return res.status(400).json({ message: "Gagal Merubah Response" });
    } else {
      const insert = await db("tbl_permohonan_response").insert({
        status,
        alasan,
        waktu,
        response,
        mailed,
        id_permohonan,
      });

      // failed
      if (!insert)
        return res.status(400).json({ message: "Gagal Menginput Response" });
    }

    // setting email
    const setMailOption = mailOption(
      email,
      "Perubahan Status Permohona Informasi",
      TextPerubahanStatus(tiket_number, email, status, reg_number, response)
    );

    // jika harus kirim email
    if (mailed) {
      await sendingMail(setMailOption).then(async (resolve) => {
        if (!resolve) {
          // ubah email tidak terkirim jika gagal
          await db("tbl_permohonan_response")
            .where("id_permohonan", id_permohonan)
            .update({
              mailed: 0,
            });
        }
      });
    }

    // success
    res.json({
      message: "Berhasil Memproses Response",
      type: "success",
    });
  });
