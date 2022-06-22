import { useState, useEffect } from "react";

export default function Thumb({ file, altText = "Pemohon" }) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState(undefined);
  const [alt, setAlt] = useState("");

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    if (typeof file === "object") {
      var reader = new FileReader();
      reader.onloadend = function () {
        setLoading(false);
        setThumb(reader.result);
        setAlt(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      setLoading(false);
      setThumb("/upload/" + file);
      setAlt(altText);
    }
  }, [file]);

  if (!file) {
    return null;
  }
  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <>
      <img
        src={thumb}
        alt={alt}
        className="img-thumbnail mt-2"
        height={200}
        width={200}
      />
    </>
  );
}
