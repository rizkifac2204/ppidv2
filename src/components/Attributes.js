import QRCode from "qrcode";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

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

export function WithDynamicImage({ image, altText = "Pemohon" }) {
  const [initImage, setInitImage] = useState("/images/no-file.png");

  useEffect(() => {
    if (!image) return;
    let mounted = true;
    const url = `/api/services/file/public/upload/${image}`;
    if (mounted)
      axios
        .get(url, {
          responseType: "arraybuffer",
        })
        .then((res) => {
          const buffer64 = Buffer.from(res.data, "binary").toString("base64");
          setInitImage(
            `data:${res.headers["content-type"]};base64, ${buffer64}`
          );
        })
        .catch((err) => {
          console.log(err.response);
        });

    return function cleanup() {
      mounted = false;
    };
  }, [image]);

  return (
    <>
      <Image
        src={initImage}
        alt={altText}
        layout="fill"
        objectFit="contain"
        priority
      />
    </>
  );
}
