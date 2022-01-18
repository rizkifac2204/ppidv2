import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function SetQRCode({ text }) {
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
