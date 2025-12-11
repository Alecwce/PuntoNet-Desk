import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurar Storage
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "puntonet-desk", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx"], // Formatos permitidos
    public_id: (req: any, file: any) => {
      // Usar nombre original sin extensión + timestamp para unicidad
      const name = file.originalname.split(".")[0];
      return `${name}-${Date.now()}`;
    },
  } as any, // "params" type override needed for some multer-storage-cloudinary versions
});

export const uploader = cloudinary.uploader;
