import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Online() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = axios
      .get(`/api/permohonan/online`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }, []);
  return <>{JSON.stringify(data)}</>;
}

Online.auth = true;
export default Online;
