import Link from "next/link";

function ResponsePermohonan({ curData, handlePrint }) {
  return (
    <>
      <br />
      <div id="success-block">
        <h4>BERHASIL MENGIRIM PERMINTAAN INFORMASI</h4>
        <div className="text-left">
          Permintaan anda sudah kami terima dan akan segera kami proses. Anda
          dapat mengecek status permohonan yang diajukan melalui link berikut{" "}
          <Link href="/cek">
            <a className="phone-mail-link">Formulir Cek Pemohonan Informasi</a>
          </Link>{" "}
          dengan mengisi data <br />
          <b>Nomor Tiket</b> : <h3>{curData.tiket_number}</h3>
          <b>Email</b> : <h3>{curData.email}</h3>
          Email yang anda terima dapat digunakan sebagai bukti Permohonan
          Informasi. Atau anda bisa cetak Bukti Permohonan{" "}
          <a onClick={() => handlePrint()}>
            <a className="phone-mail-link">Disini</a>
          </a>{" "}
          <br />
          Jika anda keberatan dengan jabawan/response kami, anda bisa mengajukan
          keberatan dengan mengisi form melalui link berikut{" "}
          <Link href="/keberatan">
            <a className="phone-mail-link">Formulir Pengajuan Keberatan</a>
          </Link>
          <br />
          Terimakasih.
        </div>
      </div>
      <br />
    </>
  );
}

export default ResponsePermohonan;
