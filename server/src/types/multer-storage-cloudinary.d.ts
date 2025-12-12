declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { v2 as cloudinary } from "cloudinary";

  interface CloudinaryStorageOptions {
    cloudinary: typeof cloudinary;
    params?: {
      folder?: string;
      format?: string;
      allowed_formats?: string[];
      resource_type?: "auto" | "image" | "video" | "raw";
      transformation?: any[];
      public_id?: (req: any, file: any) => string;
      [key: string]: any;
    };
  }

  export class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: any,
      file: any,
      callback: (error?: any, info?: any) => void
    ): void;
    _removeFile(
      req: any,
      file: any,
      callback: (error: Error | null) => void
    ): void;
  }
}
