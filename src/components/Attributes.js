import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function SetQRCode({ text }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (!text) return;
    QRCode.toDataURL(text).then((data) => {
      setSrc(data);
    });
    return () => {
      "cleanup";
    };
  }, [text]);
  return (
    <div>
      <img src={src} alt="QrCode"></img>
    </div>
  );
}

export function CurrentDate() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return dd + "/" + mm + "/" + yyyy;
}

export function FormatedDate({ tanggal }) {
  if (!tanggal) return;
  var date = new Date(tanggal);
  if (date instanceof Date && !isNaN(date.valueOf())) {
    return date.toISOString().split("T")[0];
  } else {
    return "-";
  }
}

export function NumberWithCommas({ number }) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
