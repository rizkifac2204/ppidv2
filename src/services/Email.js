const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  //   user: process.env.EMAIL,
  //   pass: process.env.EMAIL_PASS,
  // },
  pool: true,
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    // console.log("Server is ready to take our messages");
  }
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
    from: process.env.EMAIL_USER,
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
