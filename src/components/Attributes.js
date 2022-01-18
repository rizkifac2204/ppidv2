import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function SetQRCode({ text }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(text).then((data) => {
      setSrc(data);
    });
    return () => {
      "cleanup";
    };
  }, []);
  return (
    <div>
      <img src={src}></img>
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
