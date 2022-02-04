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
      cb(null, file.originalname);
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

export const DeleteUpload = (path, files) => {
  try {
    if (Array.isArray(files)) {
      files.forEach((v) => {
        if (typeof v === "object" && !Array.isArray(v) && v !== null) {
          if (fs.existsSync(path + "/" + v.filename))
            fs.unlinkSync(path + "/" + v.filename);
        } else {
          if (fs.existsSync(path + "/" + v)) fs.unlinkSync(path + "/" + v);
        }
      });
    } else {
      if (fs.existsSync(path + "/" + files)) fs.unlinkSync(path + "/" + files);
    }
  } catch (err) {
    throw err;
  }
};
