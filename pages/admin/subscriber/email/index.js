import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
// Components
import { CustomToolbar } from "components/TableComponents";
import EmailForm from "components/EmailForm";

function Email() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  const [subscriber, setSubscriber] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [detail, setDetail] = useState({});

  function fecthEmail(url) {
    axios
      .get(url)
      .then((res) => {
        setTimeout(() => {
          setData((prevRows) => res.data);
        });
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      setData((prev) => []);
    });
    const { status } = router.query;
    if (!status) return fecthEmail(`/api/subscriber/email?status=1`);
    const url =
      status === "draft"
        ? `/api/subscriber/email?status=0`
        : `/api/subscriber/email?status=1`;
    if (mounted) fecthEmail(url);

    return () => (mounted = false);
  }, [router]);

  useEffect(() => {
    axios
      .get(`/api/subscriber`)
      .then((res) => {
        setSubscriber(res.data);
      })
      .catch((err) => {
        toast.error("Terjadi Kesalahan");
      });
  }, []);

  const handleFormClose = () => {
    setOpenForm(false);
    setDetail({});
  };

  const handleDelete = (id) => {
    const ask = confirm("Yakin Hapus Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/subscriber/email/${id}`)
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
        .delete(`/api/subscriber/email`, { data: selected })
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

  const handleDraft = (detail) => {
    setOpenForm(true);
    setDetail((prev) => detail);
  };

  const columns = [
    {
      field: "oleh",
      headerName: "Oleh",
      minWidth: 200,
    },
    {
      field: "penerima",
      headerName: "Penerima",
      minWidth: 180,
    },
    {
      field: "subjek",
      headerName: "Subjek",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: (values) => {
        if (values.row.status === 0) {
          return [
            <GridActionsCellItem
              key="0"
              icon={<EditIcon />}
              label="Tulis Ulang"
              onClick={() => handleDraft(values.row)}
            />,
            <GridActionsCellItem
              key="1"
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleDelete(values.id)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            key="0"
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => router.push("/admin/subscriber/email/" + values.id)}
          />,
          <GridActionsCellItem
            key="1"
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
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => setOpenForm(true)}
        startIcon={<AddIcon />}
      >
        Tulis
      </Button>
      <Button
        variant="outlined"
        disabled={router.query.status === "send" || !router.query.status}
        sx={{ mb: 2, mx: 2 }}
        onClick={() => {
          router.push({
            pathname: "/admin/subscriber/email",
            query: { status: "send" },
          });
        }}
        startIcon={<SendIcon />}
      >
        Terkirim
      </Button>
      <Button
        variant="outlined"
        disabled={router.query.status === "draft"}
        sx={{ mb: 2 }}
        onClick={() => {
          router.push({
            pathname: "/admin/subscriber/email",
            query: { status: "draft" },
          });
        }}
        startIcon={<DraftsIcon />}
      >
        Draft
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

      <EmailForm
        open={openForm}
        onClose={handleFormClose}
        subscriber={subscriber}
        detail={detail}
        router={router}
      />
    </Card>
  );
}

Email.auth = true;
Email.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/subscriber",
    title: "Subscriber",
  },
  {
    path: "/admin/subscriber/email",
    title: "Email",
  },
];
export default Email;
