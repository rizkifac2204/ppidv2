import Link from "next/link";

function ResponseKeberatan({ curData, handlePrint }) {
  return (
    <>
      <br />
      <div id="success-block">
        <h4>BERHASIL MENGIRIM PENGAJUAN KEBERATAN</h4>
        <div className="text-left">
          Email yang anda terima dapat digunakan sebagai bukti Pengajuan
          Keberatan. Atau anda bisa cetak Bukti{" "}
          <a onClick={() => handlePrint()}>
            <a className="phone-mail-link">Disini</a>
          </a>{" "}
          <br />
          Terimakasih.
        </div>
      </div>
      <br />
    </>
  );
}

export default ResponseKeberatan;
