import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestoreIcon from "@mui/icons-material/Restore";
// Components
import { CustomToolbar } from "components/TableComponents";
import DetailPermohonan from "components/DetailPermohonan";

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

function Trash() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  // detail
  const [detail, setDetail] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  useEffect(() => {
    axios
      .get(`/api/setting/trash`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Terjadi Kesalahan");
      });
  }, []);

  const handleDelete = (detail) => {
    const ask = confirm("Hapus Data Secara Permanen?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .post(`/api/setting/trash/`, { id: detail.id, jenis: detail.jenis })
        .then((res) => {
          setTimeout(() => {
            setData((prev) => prev.filter((row) => row.id != detail.id));
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
  const handleRestore = (detail) => {
    const ask = confirm("Yakin Mengembalikan Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .put(`/api/setting/trash/`, { id: detail.id, jenis: detail.jenis })
        .then((res) => {
          setTimeout(() => {
            setData((prev) => prev.filter((row) => row.id != detail.id));
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

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const handleDetail = (detail) => {
    setDetail(detail);
    setOpenDetail(true);
  };

  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/setting/trash/`, { data: selected })
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
      field: "jenis",
      headerName: "Jenis",
    },
    {
      field: "reg_number",
      headerName: "Nomor Registrasi",
      minWidth: 100,
      flex: 1,
      renderCell: getFullReg,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: "tiket_number",
      headerName: "Tiket",
      minWidth: 180,
      hide: true,
    },
    {
      field: "kepada",
      headerName: "Kepada",
      minWidth: 180,
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      minWidth: 180,
      hide: true,
    },
    {
      field: "kabupaten",
      headerName: "Kabupaten/Kota",
      minWidth: 180,
      hide: true,
    },
    {
      field: "nama",
      headerName: "Pemohon",
      minWidth: 180,
    },
    {
      field: "telp",
      headerName: "Telp/HP",
      minWidth: 130,
      hide: true,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 130,
      hide: true,
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
      hide: true,
    },
    {
      field: "deleted_at",
      headerName: "Tanggal Hapus",
      minWidth: 120,
      valueGetter: (params) => {
        var date = new Date(params.row.deleted_at);
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
      hide: true,
    },
    {
      field: "alasan",
      headerName: "Alasan",
      minWidth: 180,
      hide: true,
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
            onClick={() => handleDetail(values.row)}
          />,
          <GridActionsCellItem
            key="1"
            icon={<RestoreIcon />}
            label="Kembalikan"
            onClick={() => handleRestore(values.row)}
          />,
          <GridActionsCellItem
            key="2"
            icon={<DeleteIcon />}
            label="Delete Permanen"
            onClick={() => handleDelete(values.row)}
          />,
        ];
      },
    },
  ];
  return (
    <>
      <Card height={630}>
        <DataGrid
          autoHeight
          rows={data}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 50]}
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
          columnBuffer={8}
        />
      </Card>

      <DetailPermohonan
        open={openDetail}
        onClose={handleCloseDetail}
        detail={detail}
      />
    </>
  );
}

Trash.auth = true;
Trash.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/trash",
    title: "Data Dibuang",
  },
];
export default Trash;
