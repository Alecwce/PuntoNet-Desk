import { Request, Response } from "express";
import { prisma } from "../index";
import multer from "multer";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../services/cloudinary.service";

// Configure Multer for temporary storage (Cloudinary will handle final storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp"); // Temporary storage
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (Cloudinary free tier supports larger files)
});

export const uploadAttachment = async (req: Request, res: Response) => {
  const { id } = req.params; // Ticket ID
  const { uploaderId } = req.body; // In real app, from auth token

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file,
      `puntonet-desk/tickets/${id}`
    );

    // Create attachment record in database with Cloudinary URL
    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.originalname,
        path: cloudinaryResult.url, // Cloudinary secure URL
        mimetype: req.file.mimetype,
        size: req.file.size,
        ticketId: id,
        uploaderId: uploaderId || "user-id-placeholder",
      },
    });

    res.json(attachment);
  } catch (error) {
    console.error("Error uploading attachment:", error);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
};

// New function to delete attachment from both DB and Cloudinary
export const deleteAttachment = async (req: Request, res: Response) => {
  const { attachmentId } = req.params;

  try {
    // Get attachment from database
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Extract publicId from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{publicId}.{ext}
    const urlParts = attachment.path.split("/");
    const publicIdWithExt = urlParts
      .slice(urlParts.indexOf("upload") + 2)
      .join("/");
    const publicId = publicIdWithExt.substring(
      0,
      publicIdWithExt.lastIndexOf(".")
    );

    // Delete from Cloudinary
    await deleteFromCloudinary(publicId);

    // Delete from database
    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    res.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    res.status(500).json({ error: "Failed to delete attachment" });
  }
};
