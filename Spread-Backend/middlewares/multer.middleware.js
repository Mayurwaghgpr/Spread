import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const imagesBasePath = path.resolve(__dirname, "../images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(__filename)
    if (file.fieldname === "NewImageFile") {
      cb(null, path.join(__dirname, "../images/userImages"));
    } else {
      cb(null, path.join(__dirname, "../images"));
    }
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === "NewImageFile" ? "userImage" : "Images";
    const fileName = `${prefix}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    // console.log(file)
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."
      ),
      false
    );
  }
};

export const multerFileUpload = multer({ storage, fileFilter }).any();
