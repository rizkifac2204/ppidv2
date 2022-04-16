import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
// Components
import { CustomToolbar } from "components/TableComponents";
import SubscriberFormAdd from "components/Subscriber/SubscriberFormAdd";

function Subscriber() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [openForm, setOpenForm] = useState(false);

  function fecthSubscriber() {
    axios
      .get(`/api/subscriber`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }

  useEffect(() => {
    fecthSubscriber();
  }, []);

  const handleDelete = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .put(`/api/subscriber`, { id })
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
        .delete(`/api/subscriber`, { data: selected })
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
      headerName: "Subscriber",
      minWidth: 200,
    },
    {
      field: "nama_subscriber",
      headerName: "Nama",
      width: 220,
    },
    {
      field: "email_subscriber",
      headerName: "Email",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Terdaftar Pada",
      width: 120,
      valueGetter: (params) => {
        return new Date(params.row.created_at).toISOString().split("T")[0];
      },
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
    <>
      <Card>
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => setOpenForm(true)}
        >
          Tambah Subscriber
        </Button>
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

      <SubscriberFormAdd
        open={openForm}
        onClose={() => setOpenForm(false)}
        fecthSubscriber={fecthSubscriber}
      />
    </>
  );
}

Subscriber.auth = true;
Subscriber.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/subscriber",
    title: "Subscriber",
  },
];
export default Subscriber;
