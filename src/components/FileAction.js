import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// MUI
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Input = styled("input")({
  display: "none",
});

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

function FileAction({ data, path, namaFile, responses, setResponses }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    if (!file) return;
    const filename = `(${data.id})_${file.name}`;
    const formData = new FormData();
    formData.append("file", file, filename);
    formData.append("id", data.id);
    formData.append("kolom", namaFile);
    axios
      .post(`/api/permohonan/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          destinationfile: path,
        },
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        const updatedResponses = responses.map((item) => {
          if (item.id == data.id) return { ...item, [namaFile]: res.data.file };
          return item;
        });
        setResponses(updatedResponses);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .then((res) => {
        setIsUploading(false);
        setProgress(0);
      });
  };
  const deleteFile = (id, file, kolom) => {
    const ask = confirm("Yakin Hapus File Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...", {
        autoClose: false,
      });
      axios
        .delete(`/api/permohonan/upload`, {
          params: { id, file, path, namaFile },
        })
        .then((res) => {
          const updatedResponses = responses.map((item) => {
            if (item.id == id) return { ...item, [namaFile]: null };
            return item;
          });
          setResponses(updatedResponses);
          toast.update(toastProses, {
            render: res.data.message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        })
        .catch((err) => {
          console.log(err);
          toast.update(toastProses, {
            render: err.response.data.message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        });
    }
  };

  if (!data[namaFile])
    return (
      <>
        {!isUploading && (
          <label htmlFor={`file` + data.id}>
            <Input id={`file` + data.id} type="file" onChange={handleUpload} />
            <IconButton color="secondary" aria-label="upload" component="span">
              <UploadFileIcon />
            </IconButton>
          </label>
        )}
        {isUploading && <CircularProgressWithLabel value={progress} />}
      </>
    );
  return (
    <>
      <a
        href={"/api/services/file/public/" + path + "/" + data[namaFile]}
        target="_blank"
        rel="noreferrer"
      >
        {data[namaFile]}
      </a>
      <br />
      <a
        href={"/api/services/file/public/" + path + "/" + data[namaFile]}
        download
      >
        <IconButton>
          <CloudDownloadIcon />
        </IconButton>
      </a>
      <IconButton
        title="Delete File"
        onClick={() => deleteFile(data.id, data[namaFile], namaFile)}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
}

export default FileAction;
