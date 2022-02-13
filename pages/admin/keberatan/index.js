import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
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

function Keberatan() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    function fetch() {
      axios
        .get(`/api/keberatans`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        });
    }
    fetch();
  }, []);

  const handleDelete = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/keberatans/` + id)
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
  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/keberatans/`, { data: selected })
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

  const columns = [
    {
      field: "reg_number",
      headerName: "Nomor Registrasi",
      width: 180,
    },
    {
      field: "tiket_number",
      headerName: "Nomor Tiket",
      width: 180,
    },
    {
      field: "kasus",
      headerName: "Kasus Posisi",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "created_at",
      headerName: "Tanggal",
      width: 120,
      valueGetter: (params) => {
        return new Date(params.row.created_at).toISOString().split("T")[0];
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: (values) => {
        return [
          <GridActionsCellItem
            key="0"
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => router.push("/admin/keberatan/" + values.id)}
          />,
          <GridActionsCellItem
            key="3"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(values.id)}
          />,
        ];
      },
    },
  ];

  return (
    <Card>
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
  );
}

Keberatan.auth = true;
Keberatan.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/keberatan",
    title: "Keberatan",
  },
];
export default Keberatan;
