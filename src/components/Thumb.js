import { useState, useEffect } from "react";

export default function Thumb({ file }) {
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState(undefined);

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    var reader = new FileReader();
    reader.onloadend = function () {
      setLoading(false);
      setThumb(reader.result);
    };
    reader.readAsDataURL(file);
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
        alt={file.name}
        className="img-thumbnail mt-2"
        height={200}
        width={200}
      />
    </>
  );
}
