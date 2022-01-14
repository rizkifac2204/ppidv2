import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";

function getFullReg(params) {
  return `${params.row.reg_number || ""} ${params.row.tiket_number || ""}`;
}

function setFullReg(params) {
  const [reg_number, tiket_number] = params.value.toString().split(" ");
  return { ...params.row, reg_number, tiket_number };
}

const columns = [
  {
    field: "registrasi",
    headerName: "Nomor Registrasi",
    width: 300,
    valueGetter: getFullReg,
    valueSetter: setFullReg,
    sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
  },
  {
    field: "kepada",
    headerName: "Kepada",
    minWidth: 180,
  },
  {
    field: "telp",
    headerName: "Telp",
    minWidth: 150,
  },
  {
    field: "status",
    headerName: "Status",
    minWidth: 150,
    flex: 1,
    editable: true,
  },
];

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
      {/* {JSON.stringify(data.length)} = {JSON.stringify(data)} */}
      <Card height={630}>
        {/* <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          checkboxSelection
          disableSelectionOnClick
        /> */}
      </Card>
    </>
  );
}

Online.auth = true;
Online.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan/online",
    title: "Permohonan Online",
  },
];
export default Online;
