import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import Card from "@mui/material/Card";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
// Components
import { CustomToolbar } from "components/TableComponents";
import DetailSurvey from "components/DetailSurvey";

function Survey() {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState({});
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    function fetch() {
      axios
        .get(`/api/surveys`)
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
        .delete(`/api/surveys/` + id)
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
        .delete(`/api/surveys/`, { data: selected })
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

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const showDetail = (values) => {
    setTimeout(() => {
      setDetail((prev) => values);
    });
    setOpenDetail(true);
  };

  const columns = [
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
      headerName: "Nama",
      minWidth: 180,
    },
    {
      field: "pendidikan",
      headerName: "Pendidikan",
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
      field: "pekerjaan",
      headerName: "Pekerjaan",
      minWidth: 130,
      hide: true,
    },
    {
      field: "alamat",
      headerName: "Alamat",
      minWidth: 150,
      hide: true,
    },
    {
      field: "satu",
      headerName: "Pertanyaan 1",
      minWidth: 130,
      hide: true,
    },
    {
      field: "dua",
      headerName: "Pertanyaan 2",
      minWidth: 130,
      hide: true,
    },
    {
      field: "tiga",
      headerName: "Pertanyaan 3",
      minWidth: 130,
      hide: true,
    },
    {
      field: "empat",
      headerName: "Pertanyaan 4",
      minWidth: 130,
      hide: true,
    },
    {
      field: "lima",
      headerName: "Pertanyaan 5",
      minWidth: 130,
      hide: true,
    },
    {
      field: "enam",
      headerName: "Pertanyaan 6",
      minWidth: 130,
      hide: true,
    },
    {
      field: "tujuh",
      headerName: "Pertanyaan 7",
      minWidth: 130,
      hide: true,
    },
    {
      field: "delapan",
      headerName: "Pertanyaan 8",
      minWidth: 130,
      hide: true,
    },
    {
      field: "sembilan",
      headerName: "Pertanyaan 9",
      minWidth: 130,
      hide: true,
    },
    {
      field: "sepuluh",
      headerName: "Pertanyaan 10",
      minWidth: 130,
      hide: true,
    },
    {
      field: "saran",
      headerName: "Saran",
      minWidth: 130,
      hide: true,
    },
    {
      field: "created_at",
      headerName: "Tanggal",
      minWidth: 120,
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
            onClick={() => showDetail(values.row)}
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

      <DetailSurvey
        open={openDetail}
        onClose={handleCloseDetail}
        fullScreen={true}
        detail={detail}
      />
    </>
  );
}

Survey.auth = true;
export default Survey;
