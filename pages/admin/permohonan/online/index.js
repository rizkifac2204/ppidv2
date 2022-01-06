import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Online() {
  const [data, setData] = useState([]);

  useEffect(() => {
    function fetch() {
      axios
        .get(`/api/permohonan/onlines`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        });
    }
    fetch();
  }, []);
  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Pemanggilan data sukses
          </Typography>
          <Typography variant="h5" component="div">
            DATA PERMOHONAN ONLINE
          </Typography>
          <Typography variant="body2">Data JSON Bisa Dibuat Table</Typography>
        </CardContent>
      </Card>
      {JSON.stringify(data.length)} = {JSON.stringify(data)}
    </>
  );
}

Online.auth = true;
export default Online;
