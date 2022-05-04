import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
// MUI
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
// ICONS
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
// Components
import { CustomPublicToolbar } from "components/TableComponents";
// COMPONENTS
import WaitLoadingComponent from "components/WaitLoadingComponent";
import {
  TextFieldCustom,
  FormControlCustom,
  InputLabelCustom,
  SelectCustom,
  MenuItemCustom,
} from "components/PublicComponents/FieldCustom";

const Dip = () => {
  const [data, setData] = useState([]);
  const [curData, setCurData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({
    unit: "",
    id_prov: "",
    id_kabkota: "",
  });
  const [search, setSearch] = useState("");
  const [provinsis, setProvinsis] = useState([]);
  const [kabkotas, setKabkotas] = useState([]);
  const formRef = useRef(null);

  // fetching wilayah
  const fetchProv = (cb) => {
    if (provinsis.length !== 0) {
      if (cb) cb();
      return;
    }
    axios
      .get(`/api/services/provinsis`)
      .then((res) => {
        setProvinsis(() => res.data);
        if (cb) cb();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchkabkota = (id, cb) => {
    axios
      .get(`/api/services/provinsis/` + id)
      .then((res) => {
        setKabkotas(() => res.data.kabkota);
        if (cb) cb();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeFilter = (event) => {
    const { name, value } = event.target;
    const prepareFilter = { ...filter, [name]: value };
    if (name === "unit") {
      prepareFilter = { ...prepareFilter, id_kabkota: "", id_prov: "" };
    }
    if (name === "id_prov") {
      prepareFilter = { ...prepareFilter, id_kabkota: "" };
    }
    setFilter((prev) => prepareFilter);
  };

  function fetchData(f) {
    const newData = [];
    axios
      .get(`/api/public/dip`, {
        params: f,
      })
      .then((res) => {
        res.data.map((item, index) => {
          newData.push({ nomor: index + 1, ...item });
        });
        setData(newData);
        setCurData(newData);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Terjadi Kesalahan");
      })
      .then(() => setLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    if (filter.unit === "") return fetchData(filter);
    if (filter.unit === "Bawaslu Republik Indonesia") return fetchData(filter);
    if (filter.unit === "Bawaslu Provinsi") {
      if (filter.id_prov) return fetchData(filter);
    }
    if (filter.unit === "Bawaslu") {
      if (filter.id_kabkota) return fetchData(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (!data) return;
    const items = data.filter((item) => {
      if (search === "") {
        return item;
      } else if (item.ringkasan?.toLowerCase().includes(search)) {
        return item;
      }
    });
    setCurData(items);
  }, [search, data]);

  const columns = [
    {
      field: "nomor",
      headerName: "No",
      width: 30,
    },
    {
      field: "nama_bawaslu",
      headerName: "Bawaslu",
      width: 180,
    },
    {
      field: "nama_divisi",
      headerName: "Unit Yang Menguasai",
      width: 180,
    },
    {
      field: "sifat",
      headerName: "Sifat",
    },
    {
      field: "jenis_informasi",
      headerName: "Jenis Informasi",
      hide: true,
    },
    {
      field: "ringkasan",
      headerName: "Ringkasan",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "no_sk",
      headerName: "Nomor SK",
      minWidth: 180,
      hide: true,
    },
    {
      field: "bentuk_informasi",
      headerName: "Bentuk Informasi",
      hide: true,
    },
    {
      field: "tahun_pembuatan",
      headerName: "Tahun",
      hide: true,
    },
    {
      field: "penanggung_jawab",
      headerName: "Unit Penanggung Jawab",
      hide: true,
    },
    {
      field: "jangka_waktu",
      headerName: "Jangka Waktu (Tahun)",
      hide: true,
    },
    {
      field: "link_file",
      type: "actions",
      headerName: "File",
      width: 200,
      cellClassName: "actions",
      getActions: (values) => {
        return [
          <GridActionsCellItem
            key="0"
            icon={<CloudDownloadIcon />}
            label="File"
            onClick={() => window.open(values.row.link_file)}
          />,
        ];
      },
    },
  ];

  return (
    <>
      <div id="dip-popup">
        <div className="background-top">
          <div className="item-title">
            <h2>
              <i className="fa fa-list-ul fa-4x" />
              <br />
              <span className="point">.D</span>IP
            </h2>
            <p>
              Kategori informasi dalam pelayanan Pengadilan terdiri dari: <br />
              1. Informasi yang wajib diumumkan secara berkala; <br />
              2. Informasi yang wajib tersedia setiap saat dan dapat diakses
              oleh publik; <br />
              3. dan Informasi yang dikecualikan.
            </p>
          </div>
          {/* .item-title */}
          <button
            className="scroll-chevron"
            onClick={() => {
              formRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <i className="fa fa-chevron-down fa-2x" />
          </button>
        </div>
        <div className="info-item" ref={formRef}>
          <div className="newsletter-block">
            {/* .block-left-newsletter */}
            <div className="col-xs-12 block-right-newsletter">
              <div id="subscribe">
                <h2>DIP.</h2>
                <p>Daftar Informasi Publik</p>
                <br />

                <div className="row">
                  <div className="col-xs-6 col-sm-4">
                    <FormControlCustom>
                      <InputLabelCustom>Bawaslu</InputLabelCustom>
                      <SelectCustom
                        name="unit"
                        value={filter.unit}
                        onChange={(e) => {
                          handleChangeFilter(e);
                          if (e.target.value !== "Bawaslu Republik Indonesia") {
                            fetchProv();
                          }
                        }}
                      >
                        <MenuItemCustom value="">Semua</MenuItemCustom>
                        <MenuItemCustom value="Bawaslu Republik Indonesia">
                          Bawaslu Republik Indonesia
                        </MenuItemCustom>
                        <MenuItemCustom value="Bawaslu Provinsi">
                          Bawaslu Provinsi
                        </MenuItemCustom>
                        <MenuItemCustom value="Bawaslu">
                          Bawaslu Kabupaten/Kota
                        </MenuItemCustom>
                      </SelectCustom>
                    </FormControlCustom>
                  </div>

                  {/* provinsi  */}
                  {filter.unit && filter.unit !== "Bawaslu Republik Indonesia" && (
                    <div className="col-xs-6 col-sm-4">
                      <FormControlCustom>
                        <InputLabelCustom>Provinsi</InputLabelCustom>
                        <SelectCustom
                          name="id_prov"
                          value={filter.id_prov}
                          onChange={(e) => {
                            handleChangeFilter(e);
                            if (filter.unit === "Bawaslu") {
                              fetchkabkota(e.target.value);
                            }
                          }}
                        >
                          <MenuItemCustom value="">--Pilih--</MenuItemCustom>
                          {provinsis.length !== 0 &&
                            provinsis.map((item, idx) => (
                              <MenuItemCustom key={idx} value={item.id}>
                                {filter.unit === "Bawaslu Provinsi" &&
                                  "Bawaslu"}{" "}
                                {item.provinsi}
                              </MenuItemCustom>
                            ))}
                        </SelectCustom>
                      </FormControlCustom>
                    </div>
                  )}

                  {/* kabkota  */}
                  {filter.unit && filter.unit === "Bawaslu" && (
                    <div className="col-xs-6 col-sm-4">
                      <FormControlCustom>
                        <InputLabelCustom>Kabupaten/Kota</InputLabelCustom>
                        <SelectCustom
                          name="id_kabkota"
                          value={filter.id_kabkota}
                          onChange={handleChangeFilter}
                        >
                          <MenuItemCustom value="">--Pilih--</MenuItemCustom>
                          {kabkotas.length !== 0 &&
                            kabkotas.map((item, idx) => (
                              <MenuItemCustom key={idx} value={item.id}>
                                BAWASLU {item.kabkota}
                              </MenuItemCustom>
                            ))}
                        </SelectCustom>
                      </FormControlCustom>
                    </div>
                  )}

                  <div className="col-xs-6 col-sm-4">
                    <TextFieldCustom
                      label="Cari Berdasarkan Ringkasan"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <br />
                <br />

                <WaitLoadingComponent loading={loading} />
                {!loading && (
                  <DataGrid
                    sx={{ fontSize: "1.3rem", mb: 10 }}
                    autoHeight
                    rows={curData}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 10, 20]}
                    components={{
                      Toolbar: CustomPublicToolbar,
                    }}
                  />
                )}
              </div>
            </div>
            {/* .block-right-newsletter */}
            <div className="clear" />
            <div className="legal-info col-md-12">
              <div className="text-center">
                <p>
                  Pejabat Pengelola Informasi dan Dokumentasi Bawaslu
                  Terintegrasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Dip.public = true;
export default Dip;
