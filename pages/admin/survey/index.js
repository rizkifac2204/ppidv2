import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Survey() {
  const [data, setData] = useState([]);

  useEffect(() => {
    function fetch() {
      axios
        .get(`/api/survey`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        });
    }
    fetch();
  }, []);
  return <>{JSON.stringify(data)}</>;
}

Survey.auth = true;
export default Survey;
