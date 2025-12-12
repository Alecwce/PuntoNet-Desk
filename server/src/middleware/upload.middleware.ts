import multer from "multer";
import cloudinary from "../services/cloudinary.service";

// Workaround for TypeScript/CommonJS mismatch with this specific library version
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Storage directo a Cloudinary (NO diskStorage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "puntonet-desk/attachments",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "txt",
    ],
    resource_type: "auto",
    transformation: [{ quality: "auto" }],
  },
});

// Validación de archivos
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});
