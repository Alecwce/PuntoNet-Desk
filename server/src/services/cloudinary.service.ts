import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param file - The file to upload (from multer)
 * @param folder - The folder in Cloudinary to store the file
 * @returns Promise with the upload result
 */
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = "ticket-attachments"
): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: "auto", // Automatically detect file type
      use_filename: true,
      unique_filename: true,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

/**
 * Delete a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @returns Promise with the deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};

/**
 * Get optimized URL for an image with transformations
 * @param publicId - The public ID of the image
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized URL
 */
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: "fill" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  });
};

export default cloudinary;
