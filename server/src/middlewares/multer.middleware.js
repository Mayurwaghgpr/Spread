import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go one level up from src -> to project root, then into images/
const imagesBasePath = path.resolve(__dirname, "../../images");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "NewImageFile") {
      const userImagesPath = path.join(imagesBasePath, "userImages");
      // Create directory if it doesn't exist
      if (!fs.existsSync(userImagesPath)) {
        fs.mkdirSync(userImagesPath, { recursive: true });
      }
      cb(null, userImagesPath);
    } else {
      cb(null, path.join(imagesBasePath));
    }
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === "NewImageFile" ? "userImage" : "Images";
    const fileName = `${prefix}-${Date.now()}${path.extname(
      file.originalname,
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
        "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.",
      ),
      false,
    );
  }
};

export const multerFileUpload = multer({ storage, fileFilter }).any();
