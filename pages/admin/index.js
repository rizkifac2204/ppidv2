import { useState, useEffect } from "react";
import axios from "axios";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Index() {
  const [main, setMain] = useState({});
  const [status, setStatus] = useState({});
  const [unresponse, setUnresponse] = useState({});

  useEffect(() => {
    function getMain() {
      axios
        .get(`api/dashboard/main`)
        .then((res) => {
          setMain(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getStatus() {
      axios
        .get(`api/dashboard/status`)
        .then((res) => {
          setStatus(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getUnresponse() {
      axios
        .get(`api/dashboard/unresponse`)
        .then((res) => {
          setUnresponse(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getMain();
    getStatus();
    getUnresponse();
  }, []);
  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Pemanggilan data sukses
          </Typography>
          <Typography variant="h5" component="div">
            Tinggal Atur Tampilan
          </Typography>
          <Typography variant="body2">
            Data API, Data AUTH, Data Validasi sudah selesai semua. <br />{" "}
            Tinggal Olah Data Pada Tampilan
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275, mb: 2, p: 2 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Data Pada Header yang biasanya seperti Card
        </Typography>
        <CardContent>
          <Typography variant="body2">
            {JSON.stringify(Object.keys(main).length)} = {JSON.stringify(main)}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275, mb: 2, p: 2 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Data Tabel dengan icon/progress <br />
          Dibuat dengan 2 tampilan (online dan offline)
        </Typography>
        <CardContent>
          <Typography variant="body2">
            {JSON.stringify(Object.keys(status).length)} ={" "}
            {JSON.stringify(status)}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275, mb: 2, p: 2 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Data Tabel dengan icon/progress
        </Typography>
        <CardContent>
          <Typography variant="body2">
            {JSON.stringify(Object.keys(unresponse).length)} ={" "}
            {JSON.stringify(unresponse)}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

Index.auth = true;
export default Index;
