import multer from "multer";
import * as fs from "fs";

const storage = () => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `./public/${req.headers.destinationfile}`;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
};

// saat ini belum dipakai karena mendukung semua file
const filterFile = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Hanya JPG, JPEG dan PNG!"));
  }
};

export const Upload = () =>
  multer({
    storage: storage(),
    // fileFilter: filterFile,
    // limits: { fileSize: 1048576 }, // hanya dibatasi 1mb
  });

export const UploadPublic = () =>
  multer({
    storage: storage(),
    fileFilter: filterFile,
    limits: { fileSize: 1048576 }, // hanya dibatasi 1mb
  });

function prosesDelete(path, file) {
  if (fs.existsSync(path + "/" + file)) fs.unlinkSync(path + "/" + file);
}

export const DeleteUpload = (path, files) => {
  if (!files) return;
  try {
    if (typeof files === "object") {
      if (Array.isArray(files)) {
        files.forEach((v) => {
          if (typeof v === "object" && !Array.isArray(v) && v !== null) {
            prosesDelete(path, v.filename);
          } else {
            prosesDelete(path, v);
          }
        });
      } else {
        if (
          typeof files === "object" &&
          !Array.isArray(files) &&
          files !== null
        ) {
          prosesDelete(path, files.filename);
        } else {
          prosesDelete(path, files);
        }
      }
    } else {
      prosesDelete(path, files);
    }
  } catch (err) {
    throw err;
  }
};
