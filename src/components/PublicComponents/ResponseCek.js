import { useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { FormatedDate, WithDynamicImage } from "components/Attributes";

function getValueResponse(show = 0, obj, param, download) {
  if (!obj.responses) return "Tidak Tersedia";
  const idx = show ? show : 0;
  if (obj.responses[idx][param]) {
    if (download) {
      const url = `/api/services/file/public/${download}/${obj.responses[idx][param]}`;
      return (
        <a href={url} download>
          <i className="fa fa-download"></i>
        </a>
      );
    } else {
      return obj.responses[idx][param];
    }
  }
  return "Tidak Ditemukan";
}

function ResponseCek({ curData, handlePrint, reset }) {
  const [show, setShow] = useState(0);
  return (
    <>
      <div className="first-block">
        <div className="container">
          <div className="col-md-12">
            <h2>Ditemukan</h2>
            <h3>Verikut Detail Permohonan {curData.tiket}</h3>
          </div>
        </div>
      </div>
      <div className="container info-block">
        <div className="col-xs-12 col-sm-12 col-lg-8">
          <h3>Nomor Tiket : {curData.tiket}</h3>
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td>Nomor Registrasi</td>
                  <td>
                    : <b>{curData.no_registrasi}</b>
                    {!curData.no_registrasi && <>Saat ini belum tersedia</>}
                  </td>
                </tr>
                <tr>
                  <td>Ditujukan Kepada</td>
                  <td>
                    : <b>{curData.nama_bawaslu}</b>
                  </td>
                </tr>
                <tr>
                  <td>Rincian Informasi</td>
                  <td>: {curData.rincian}</td>
                </tr>
                <tr>
                  <td>Tujuan Informasi</td>
                  <td>: {curData.tujuan}</td>
                </tr>
                <tr>
                  <td>Status Permohonan</td>
                  <td>: {curData.status_permohonan} </td>
                </tr>
                <tr>
                  <td>Cetak Bukti Permohonan</td>
                  <td>
                    :{" "}
                    <a onClick={() => handlePrint()} role="button">
                      <i>Cetak</i>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Surat Pemberitahuan</td>
                  <td>
                    :{" "}
                    {getValueResponse(
                      show,
                      curData,
                      "file_surat_pemberitahuan",
                      "pemberitahuan"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>File Informasi</td>
                  <td>
                    :{" "}
                    {getValueResponse(
                      show,
                      curData,
                      "file_informasi",
                      "response"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Tanggal Respon</td>
                  <td>
                    :{" "}
                    <FormatedDate
                      tanggal={getValueResponse(
                        show,
                        curData,
                        "tanggal_respon"
                      )}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Pesan</td>
                  <td>: {getValueResponse(show, curData, "pesan")}</td>
                </tr>
                <tr>
                  <td>Jumlah Response</td>
                  <td>
                    : {curData.responses ? curData.responses.length : 0}{" "}
                    {curData.responses && curData.responses.length > 1 && (
                      <select
                        className="form form-control"
                        onChange={(e) => {
                          setShow(e.target.value);
                        }}
                      >
                        <option value="">Pilih Tampilan Response</option>
                        {curData.responses.map((item, index) => (
                          <option key={index} value={index}>
                            {index + 1} - {item.jenis_respon}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Anda akan mendapatkan email ketika perubahan status dilakukan admin,
            atau anda bisa melakukan pengecekan kembali dihalaman ini.
            <br />
            Jika anda keberatan dengan jabawan/response kami, anda bisa
            mengajukan keberatan dengan mengisi form melalui link{" "}
            <Link href="/keberatan">
              <a className="phone-mail-link">Formulir Pengajuan Keberatan</a>
            </Link>
          </p>
          <Button
            size="large"
            variant="outlined"
            endIcon={<SendIcon />}
            onClick={reset}
          >
            Cek Permohonan Lain
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

export default ResponseCek;
