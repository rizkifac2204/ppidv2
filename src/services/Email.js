const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const TextPerubahanStatus = (
  tiket_number,
  email,
  status,
  reg_number,
  response
) => {
  return ` Salam Awas. <br/>
    <p>
      Permohonan Informasi yang anda ajukan kepada PPID Bawaslu dengan data
    </p>
    Nomor Tiket <b>${tiket_number}</b> <br/>
    Email <b>${email}</b><br/>
    <p>
       Telah ditanggapi oleh Admin. Status aktif Status aktif pada Permohonan Informasi tersebut sekarang adalah
    </p>
    <h3>${status}</h3>
    Nomor Registrasi <b>${reg_number}</b> <br/>
    Dengan pesan/response <b>${response}</b><br/>
  
    <p>
      Anda Dapat Cek dan Cetak Bukti Permohonan Informasi Anda <a href='".$URLCekPermohonan."' target='_blank'>Disini</a> <br/>
      Atau anda dapat mengajukan keberatan dengan mengisi formulir Pengajuan Keberatan <a href='".$URLKeberatan."' target='_blank'>Disini</a>.
    </p>
  
    Terimakasih<br/>
    Bawaslu Terbuka, Pemilu Terpercaya<br/>
    --PPID Bawaslu`;
};

export const mailOption = (to, subject, text) => {
  const option = {
    from: "ppid.bawaslu@go.id",
    to: to,
    subject: subject,
    html: text,
  };
  return option;
};

const sendingMail = (setMailOption) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(setMailOption, (err, data) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

export default sendingMail;
