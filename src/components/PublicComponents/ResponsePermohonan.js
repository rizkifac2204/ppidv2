import Link from "next/link";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

function ResponsePermohonan({ curData, handlePrint, reset }) {
  return (
    <>
      <div className="first-block">
        <div className="container">
          <div className="col-md-12">
            <h2>Sukses</h2>
            <h3>Berhasil Mengirim Permohonan Informasi</h3>
          </div>
        </div>
      </div>
      <div className="container info-block">
        <div className="col-xs-12 col-sm-12 col-lg-8">
          <h3>
            Terima<span className="point">kasih</span>
            <br />
            <small>{curData.nama_pemohon}</small>
          </h3>
          <p>
            Permintaan anda sudah kami terima dan akan segera kami proses. Anda
            dapat mengecek status permohonan yang diajukan melalui link
            <Link href="/cek">
              <a> Formulir Cek Pemohonan Informasi </a>
            </Link>
            dengan mengisi data :
          </p>
          <br />
          <b>Nomor Tiket</b> : <h3>{curData.tiket}</h3>
          <b>Email</b> : <h3>{curData.email_pemohon}</h3>
          <p>
            Email yang anda terima dapat digunakan sebagai bukti Permohonan
            Informasi. Atau anda bisa cetak Bukti Permohonan{" "}
            <a onClick={() => handlePrint()}>Disini</a>
            <br />
            Jika anda keberatan dengan jabawan/response kami, anda bisa
            mengajukan keberatan dengan mengisi form melalui link{" "}
            <Link href="/keberatan">
              <a className="phone-mail-link">Formulir Pengajuan Keberatan</a>
            </Link>
          </p>
          <br />
          <br />
          <Button
            size="large"
            variant="outlined"
            endIcon={<SendIcon />}
            onClick={reset}
          >
            Ajukan Permohonan Kembali
          </Button>
        </div>
        <div className="col-xs-12 col-sm-12 col-lg-4">
          <img
            alt=""
            className="img-responsive img-right-about"
            src="/images/icon.png"
          />
          <p className="on-right">
            Terimakasih
            <br />
            Bawaslu Terbuka, Bawaslu Terpercaya
          </p>
        </div>
      </div>
    </>
  );
}

export default ResponsePermohonan;
