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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
// Components
import { CustomToolbar } from "components/TableComponents";

function Users() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    function fetchData() {
      axios
        .get(`/api/setting/users`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    fetchData();
  }, []);

  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/setting/users/`, { data: selected })
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
        .delete(`/api/setting/users/` + id)
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

  const actionColumn = (values) => {
    if (values.row.myself) {
      return [
        <Link href={`/admin/profile`}>
          <a>
            <ManageAccountsIcon fontSize="small" />
          </a>
        </Link>,
      ];
    }
    if (values.row.editable) {
      return [
        <Link href={`/admin/setting/users/${values.id}`}>
          <a>
            <ManageAccountsIcon fontSize="small" />
          </a>
        </Link>,
        <GridActionsCellItem
          key="2"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(values.id)}
        />,
      ];
    } else {
      return [
        <Link href={`/admin/setting/users/${values.id}`}>
          <a>
            <VisibilityIcon fontSize="small" />
          </a>
        </Link>,
      ];
    }
  };

  const columns = [
    {
      field: "level",
      headerName: "Sebagai",
      minWidth: 180,
    },
    {
      field: "nama_bawaslu",
      headerName: "Bawaslu",
      minWidth: 220,
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      minWidth: 180,
      hide: true,
    },
    {
      field: "nama_admin",
      headerName: "Nama",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "telp_admin",
      headerName: "Telp/HP",
      minWidth: 180,
    },
    {
      field: "email_admin",
      headerName: "Email",
      minWidth: 180,
      hide: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: (values) => actionColumn(values),
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
          isRowSelectable={(params) => params.row.editable}
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
    </>
  );
}

Users.auth = true;
Users.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/setting/users",
    title: "Users",
  },
];
export default Users;
