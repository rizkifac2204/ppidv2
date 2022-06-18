import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
// MUI
import Card from "@mui/material/Card";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
// Components
import { CustomToolbar } from "components/TableComponents";

function Dip() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    function fetch() {
      axios
        .get(`/api/dip`)
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
        .delete(`/api/dip/` + id)
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
        .delete(`/api/dip/`, { data: selected })
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
      field: "nama_bawaslu",
      headerName: "Bawaslu",
      width: 180,
    },
    {
      field: "nama_divisi",
      headerName: "Unit",
      width: 180,
    },
    {
      field: "sifat",
      headerName: "Sifat",
      width: 180,
    },
    {
      field: "jenis_informasi",
      headerName: "Jenis Informasi",
      width: 180,
    },
    {
      field: "ringkasan",
      headerName: "Ringkasan",
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
          <Link href={`/admin/dip/${values.id}`}>
            <a>
              <VisibilityIcon fontSize="small" />
            </a>
          </Link>,
          <GridActionsCellItem
            key="1"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => router.push("/admin/dip/" + values.id + "/edit")}
          />,
          <GridActionsCellItem
            key="2"
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

Dip.auth = true;
Dip.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/dip",
    title: "Daftar Informasi Publik",
  },
];
export default Dip;
