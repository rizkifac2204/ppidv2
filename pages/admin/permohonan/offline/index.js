import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
// MUI
import Card from "@mui/material/Card";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
// Components
import { CustomToolbar } from "components/TableComponents";
import BuktiPermohonanOnline from "components/PrintPage/BuktiPermohonanOnline";

function Offline() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  // for print
  const [detail, setDetail] = useState({});
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const printBuktiRef = useRef();

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

  // function for print
  const fetchProfileBawaslu = (id, callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/permohonan/profileBawaslu?id=` + id)
      .then((res) => {
        setProfileBawaslu(res.data);
        toast.dismiss(toastProses);
        callback();
      })
      .catch((err) => {
        console.log(err);
        toast.update(toastProses, {
          render: "Terjadi Kesalahan",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };
  const processPrint = useReactToPrint({
    content: () => printBuktiRef.current,
  });
  const handlePrintClick = (values) => {
    setTimeout(() => {
      setDetail((prev) => values);
    });
    fetchProfileBawaslu(values.id_will, () => {
      processPrint();
    });
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = () => {
      axios
        .get(`/api/permohonan/offlines`)
        .then((res) => {
          setTimeout(() => {
            setData((prev) => res.data);
          });
        })
        .catch((err) => {
          toast.error("Terjadi Kesalahan");
        });
    };
    if (mounted) fetchData();
    return () => (mounted = false);
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
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
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
            onClick={() =>
              router.push("/admin/permohonan/offline/" + values.id)
            }
          />,
          <GridActionsCellItem
            key="2"
            icon={<PrintIcon />}
            label="Print"
            onClick={() => handlePrintClick(values.row)}
            showInMenu
          />,
          <GridActionsCellItem
            key="3"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(values.id)}
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

      <BuktiPermohonanOnline
        ref={printBuktiRef}
        detail={detail}
        profileBawaslu={profileBawaslu}
      />
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
