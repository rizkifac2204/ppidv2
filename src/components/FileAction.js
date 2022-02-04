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

function FileAction({ response, setResponse, id_permohonan, path }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  // FILE
  const handleUpload = (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    if (!file) return;
    const filename = `(${id_permohonan})_${file.name}`;
    const form = new FormData();
    form.append("file", file, filename);
    form.append("id_permohonan", id_permohonan);
    axios
      .post(`/api/permohonan/upload`, form, {
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
        setResponse({
          ...response,
          file: filename,
          id_permohonan: id_permohonan,
        });
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .then((res) => {
        setIsUploading(false);
        setProgress(0);
      });
  };
  const deleteFile = (id, file) => {
    const ask = confirm("Yakin Hapus File Data?");
    if (ask) {
      const toastProses = toast.loading("Tunggu Sebentar...");
      axios
        .delete(`/api/permohonan/upload`, { params: { id, file, path } })
        .then((res) => {
          setResponse({ ...response, file: null });
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

  if (!response.file)
    return (
      <>
        {!isUploading && (
          <label htmlFor="icon-button-file">
            <Input id="icon-button-file" type="file" onChange={handleUpload} />
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
        href={"/" + path + "/" + response.file}
        target="_blank"
        rel="noreferrer"
      >
        {response.file}
      </a>
      <br />
      <a href={"/" + path + "/" + response.file} download>
        <IconButton>
          <CloudDownloadIcon />
        </IconButton>
      </a>
      <IconButton
        title="Delete File"
        onClick={() => deleteFile(id_permohonan, response.file)}
      >
        <DeleteIcon />
      </IconButton>
    </>
  );
}

export default FileAction;
