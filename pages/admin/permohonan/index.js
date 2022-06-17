import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
// MUI
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
// Components
import { CustomToolbar } from "components/TableComponents";
import ResponseDialog from "components/permohonan/ResponseDialog";
import DataPermohonan from "components/PrintPage/DataPermohonan";

function getFullReg(params) {
  return (
    <>
      <Typography>
        {params.row.no_registrasi}
        <br />
        <Typography variant="caption" color="primary">
          {params.row.tiket}
        </Typography>
      </Typography>
    </>
  );
}

function Permohonan() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  // proses response
  const [detail, setDetail] = useState({});
  const [openResponse, setOpenResponse] = useState(false);
  const [profileBawaslu, setProfileBawaslu] = useState({});
  const printRef = useRef();

  // call for response dan print
  const fetchProfileBawaslu = (id, callback) => {
    const toastProses = toast.loading("Menyiapkan Format...");
    axios
      .get(`/api/services/profileBawaslu?id=` + id)
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

  const handleDeleteSelected = () => {
    const ask = confirm("Yakin Hapus Data Terpilih?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/`, { data: selected })
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
        .delete(`/api/permohonan/` + id)
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
    fetchProfileBawaslu(values.bawaslu_id, () => {
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
    handleOpenResponse();
  };

  useEffect(() => {
    let mounted = true;
    const fetchData = () => {
      axios
        .get(`/api/permohonan`)
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
      field: "no_registrasi",
      headerName: "Nomor Registrasi",
      width: 300,
      renderCell: getFullReg,
      valueFormatter: ({ value }) => `${value}`,
    },
    {
      field: "tiket",
      headerName: "Tiket",
      minWidth: 180,
      hide: true,
    },
    {
      field: "nama_bawaslu",
      headerName: "Kepada",
      minWidth: 180,
    },
    {
      field: "platform",
      headerName: "Platform",
      minWidth: 180,
      hide: true,
    },
    {
      field: "provinsi",
      headerName: "Provinsi",
      minWidth: 180,
      hide: true,
    },
    {
      field: "nama_pemohon",
      headerName: "Pemohon",
      minWidth: 180,
    },
    {
      field: "telp_pemohon",
      headerName: "Telp/HP",
      minWidth: 130,
      hide: true,
    },
    {
      field: "email_pemohon",
      headerName: "Email",
      minWidth: 130,
      hide: true,
    },
    {
      field: "tanggal_permohonan",
      headerName: "Tanggal",
      minWidth: 120,
      valueGetter: (params) => {
        var date = new Date(params.row.tanggal_permohonan);
        if (date instanceof Date && !isNaN(date.valueOf())) {
          return date.toISOString().split("T")[0];
        } else {
          return "-";
        }
      },
    },
    {
      field: "status_permohonan",
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
      getActions: (values) => {
        return [
          <GridActionsCellItem
            key="0"
            icon={<VisibilityIcon />}
            label="Detail"
            onClick={() => router.push("/admin/permohonan/" + values.id)}
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
        setDetail={setDetail}
        data={data}
        setData={setData}
      />
      <DataPermohonan
        ref={printRef}
        detail={detail}
        profileBawaslu={profileBawaslu}
      />
    </>
  );
}

Permohonan.auth = true;
Permohonan.breadcrumb = [
  {
    path: "/admin",
    title: "Home",
  },
  {
    path: "/admin/permohonan",
    title: "Permohonan",
  },
];
export default Permohonan;
