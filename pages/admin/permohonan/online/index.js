import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
// Components
import { CustomToolbar } from "components/TableComponents";
import ResponseDialog from "components/ResponseDialog";
import DataPermohonanOnline from "components/PrintPage/DataPermohonanOnline";

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
  // proses response
  const [detail, setDetail] = useState({});
  const [openResponse, setOpenResponse] = useState(false);
  const [response, setResponse] = useState({});
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const printRef = useRef();
  // call for response dan print
  const fetchResponse = (id, callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/permohonan/onlines/` + id + "/response")
      .then((res) => {
        setResponse(res.data);
        callback();
        toast.dismiss(toastProses);
      })
      .catch((err) => {
        toast.update(toastProses, {
          render: "Terjadi Kesalahan",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };
  const fetchProfileBawaslu = (id, callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/permohonan/profileBawaslu?id=` + id)
      .then((res) => {
        console.log(res.data);
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

  const processPrint = useReactToPrint({
    content: () => printRef.current,
  });
  const handlePrintClick = (values) => {
    setTimeout(() => {
      setDetail((prev) => values);
    });
    fetchProfileBawaslu(values.id_will, () => {
      processPrint();
    });
  };

  const handleOpenResponse = () => {
    setOpenResponse(true);
  };
  const handleCloseResponse = () => {
    setOpenResponse(false);
  };

  const hanldeResponse = (values) => {
    setTimeout(() => {
      setDetail((prev) => values);
    });
    fetchResponse(values.id, () => {
      handleOpenResponse();
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
      width: 300,
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
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      editable: true,
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
            onClick={() => router.push("/admin/permohonan/online/" + values.id)}
          />,
          <GridActionsCellItem
            key="1"
            icon={<LocalLibraryIcon />}
            label="Tanggapi"
            onClick={() => hanldeResponse(values.row)}
            showInMenu
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
      <Card height={630}>
        <Link href="/admin/permohonan/online/add" passHref>
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
      {/* COMPONEN */}
      <ResponseDialog
        open={openResponse}
        onClose={handleCloseResponse}
        fullScreen={true}
        detail={detail}
        response={response}
        setDetail={setDetail}
        setResponse={setResponse}
      />
      <DataPermohonanOnline
        ref={printRef}
        detail={detail}
        profileBawaslu={profileBawaslu}
      />
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
