import { Request, Response } from "express";
import { prisma } from "../index";
import { upload as uploadMiddleware } from "../middleware/upload.middleware";
import { uploader } from "../config/cloudinary.config";

export const upload = uploadMiddleware;

export const uploadAttachment = async (req: Request, res: Response) => {
  const { id } = req.params; // Ticket ID
  // const { uploaderId } = req.body; // In real app, from auth token (middleware)

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // CloudinaryStorage (multer) already uploaded the file.
    // req.file.path contains the secure URL.
    // req.file.filename contains the public_id.

    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.originalname,
        path: req.file.path, // Cloudinary URL
        mimetype: req.file.mimetype,
        size: req.file.size,
        ticketId: id,
        // Assuming default uploader if not present in request (should be fixed in auth middleware)
        uploaderId: req.body.uploaderId || "user-id-placeholder",
      },
    });

    res.json(attachment);
  } catch (error) {
    console.error("Error uploading attachment:", error);
    // Cleanup if DB fails
    if (req.file && (req.file as any).filename) {
      await uploader.destroy((req.file as any).filename);
    }
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

    // Try to extract public_id from path
    try {
      const urlParts = attachment.path.split("/");
      // Example: .../upload/v12345/puntonet-desk/filename.jpg
      // We need: puntonet-desk/filename (without extension usually, depending on resource_type)

      // Simpler approach: if we moved to storing keys properly we'd simple use that.
      // For now, let's try to parse or just ignore if it fails, relying on the DB delete.

      // Regex to find public_id after "upload/" and version "v123/"
      const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
      const match = attachment.path.match(regex);
      if (match && match[1]) {
        await uploader.destroy(match[1]);
      }
    } catch (err) {
      console.warn("Failed to delete from Cloudinary:", err);
    }

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
