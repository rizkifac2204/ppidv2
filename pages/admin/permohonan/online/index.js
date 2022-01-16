import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
// Components
import { CustomToolbar } from "components/TableComponents";

function getFullReg(params) {
  return (
    <>
      <Typography>
        {params.row.reg_number}
        <br />
        <Typography variant="caption" color="primary">
          {params.row.tiket_number}
        </Typography>
      </Typography>
    </>
  );
}

function Online() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/onlines/`, { data: selected })
        .then((res) => {
          setTimeout(() => {
            setData((prevRows) =>
              prevRows.filter((row) => !selected.includes(row.id))
            );
          });
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        })
        .catch((err) => {
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };
  const handleDeleteClick = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/onlines/` + id)
        .then((res) => {
          setTimeout(() => {
            setData((prev) => prev.filter((row) => row.id != id));
          });
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        })
        .catch((err) => {
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };
  const handlePrintClick = (id) => {
    console.log("print " + id);
  };

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`/api/permohonan/onlines`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        });
    };
    fetchData();
    return () => {
      // console.log("clear");
    };
  }, []);

  const columns = [
    {
      field: "registrasi",
      headerName: "Nomor Registrasi",
      width: 300,
      renderCell: getFullReg,
      sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
    },
    {
      field: "kepada",
      headerName: "Kepada",
      minWidth: 180,
    },
    {
      field: "tanggal",
      headerName: "Tanggal",
      minWidth: 120,
      valueGetter: (params) => {
        var date = new Date(params.row.tanggal);
        if (date instanceof Date && !isNaN(date.valueOf())) {
          return date.toISOString().split("T")[0];
        } else {
          return "-";
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      editable: true,
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
            key="0"
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => router.push("/admin/permohonan/online/" + id)}
          />,
          <GridActionsCellItem
            key="1"
            icon={<EditIcon />}
            label="Edit"
            onClick={() =>
              router.push("/admin/permohonan/online/" + id + "/edit")
            }
            showInMenu
          />,
          <GridActionsCellItem
            key="2"
            icon={<PrintIcon />}
            label="Print"
            onClick={() => handlePrintClick(id)}
            showInMenu
          />,
          <GridActionsCellItem
            key="3"
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
      <Card height={630}>
        <Link href="/admin/permohonan/online/add">
          <Button variant="outlined" sx={{ mb: 2 }}>
            Tambah Data Sebelumnya
          </Button>
        </Link>
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(itm) => setSelected(itm)}
          components={{
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            toolbar: {
              selectedItem: selected,
              handleDeleteSelected: handleDeleteSelected,
            },
          }}
        />
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
