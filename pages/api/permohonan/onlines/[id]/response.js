import db from "libs/db";
import Handler from "middlewares/Handler";

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

      res.json({ message: "Berhasil Merubah Response", type: "success" });
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

      res.json({ message: "Berhasil Menginput Response", type: "success" });
    }
  });

// if ($mailed) {
//   // createMessage
//   $messageToPemohon = "Salam Awas. <br/>
//   <p>
//     Permohonan Informasi yang anda ajukan kepada PPID Bawaslu dengan data
//   </p>
//   Nomor Tiket <b>".$tiket_number."</b> <br/>
//   Email <b>".$email."</b><br/>
//   <p>
//      Telah ditanggapi oleh Admin. Status aktif Status aktif pada Permohonan Informasi tersebut sekarang adalah
//   </p>
//   <h3>".$status."</h3>
//   Nomor Registrasi <b>".$reg_number."</b> <br/>
//   Dengan pesan/response <b>".$response."</b><br/>

//   <p>
//     Anda Dapat Cek dan Cetak Bukti Permohonan Informasi Anda <a href='".$URLCekPermohonan."' target='_blank'>Disini</a> <br/>
//     Atau anda dapat mengajukan keberatan dengan mengisi formulir Pengajuan Keberatan <a href='".$URLKeberatan."' target='_blank'>Disini</a>.
//   </p>

//   Terimakasih<br/>
//   Bawaslu Terbuka, Pemilu Terpercaya<br/>
//   --PPID Bawaslu";
//   // proses kirim
//   mail($email,"Perubahan Status Permohonan Informasi PPID Bawaslu",$messageToPemohon,$headermails);
// }
