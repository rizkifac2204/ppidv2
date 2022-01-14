import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import SecurityIcon from "@mui/icons-material/Security";

function Offline() {
  const router = useRouter();
  const [data, setData] = useState([]);

  const handleDeleteClick = (id) => {
    console.log("delete " + id);
  };
  const handlePrintClick = (id) => {
    console.log("print " + id);
  };

  function fetchData() {
    axios
      .get(`/api/permohonan/offlines`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }
  useEffect(() => {
    // let isCancelled = false;
    // if (!isCancelled)
    fetchData();
    return () => {
      // isCancelled = true;
    };
  }, []);

  const columns = [
    {
      field: "reg_number",
      headerName: "Nomor Registrasi",
      width: 200,
    },
    {
      field: "kepada",
      headerName: "Kepada",
      width: 300,
      valueGetter: (params) => {
        return `${params.row.kepada || ""} ${params.row.provinsi || ""} ${
          params.row.kabupaten || ""
        }`;
      },
      sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
    },
    {
      field: "tanggal",
      headerName: "Tanggal",
      minWidth: 120,
      valueGetter: (params) => {
        return new Date(params.row.tanggal).toISOString().split("T")[0];
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => router.push("/admin/permohonan/offline/" + id)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() =>
              router.push("/admin/permohonan/offline/" + id + "/edit")
            }
            showInMenu
          />,
          <GridActionsCellItem
            icon={<PrintIcon />}
            label="Print"
            onClick={() => handlePrintClick(id)}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            showInMenu
          />,
        ];
      },
    },
  ];

  return (
    <>
      <Card sx={{ minWidth: 275, mb: 2 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Pemanggilan data sukses
          </Typography>
          <Typography variant="h5" component="div">
            DATA PERMOHONAN OFFLINE
          </Typography>
          <Typography variant="body2">Data JSON Bisa Dibuat Table</Typography>
        </CardContent>
      </Card>
      <Card>
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20, 50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Card>
    </>
  );
}

Offline.auth = true;
Offline.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan/offline",
    title: "Permohonan Offline",
  },
];
export default Offline;
