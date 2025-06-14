// lib/multer.ts
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";


const storage = multer.diskStorage({
  destination: "./public/temp", 
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage });