import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
// Components
import { CustomToolbar } from "components/TableComponents";

function Offline() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/offlines/`, { data: selected })
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
        .delete(`/api/permohonan/offlines/` + id)
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
        .get(`/api/permohonan/offlines`)
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
            key="0"
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => router.push("/admin/permohonan/offline/" + id)}
          />,
          <GridActionsCellItem
            key="1"
            icon={<EditIcon />}
            label="Edit"
            onClick={() =>
              router.push("/admin/permohonan/offline/" + id + "/edit")
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
