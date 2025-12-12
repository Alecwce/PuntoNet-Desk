import { Request, Response } from "express";
import { prisma } from "../index";
import cloudinary, {
  deleteFromCloudinary,
} from "../services/cloudinary.service";

// Multer upload logic is now in middleware/upload.middleware.ts
// We import the upload middleware in the routes, not here.

export const uploadAttachment = async (req: Request, res: Response) => {
  const { id } = req.params; // Ticket ID (UUID from URL)
  // const { uploaderId } = req.body; // In real app, from auth token, handled below if needed or passed in body

  // NOTE: In a real scenario, you'd get the current user ID from req.user (middleware auth)
  // For now we might need to rely on what's passed or a default/placeholder if auth isn't fully set up in this context.
  // Assuming 'uploaderId' is sent in body or we use a placeholder.
  const uploaderId = req.body.uploaderId || "user-id-placeholder";

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // req.file.path is the secure_url from Cloudinary when using CloudinaryStorage
    // req.file.filename is the public_id usually (or we can use req.file.filename provided by multer-storage-cloudinary)

    // Create attachment record in database with Cloudinary URL
    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.originalname,
        path: req.file.path, // Cloudinary URL
        mimetype: req.file.mimetype,
        size: req.file.size,
        ticketId: id, // ticketId is String/UUID based on schema
        uploaderId: uploaderId,
      },
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  const { attachmentId } = req.params; // Assuming route is DELETE /:attachmentId

  try {
    // Get attachment from database
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    // Extract publicId from Cloudinary URL if we don't store it explicitly
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{publicId}.{ext}
    // OR if we used 'folder/filename' in storage, we need to extract that.

    // Strategy: Try to extract public ID from the URL.
    // Cloudinary URL: https://res.cloudinary.com/demo/image/upload/v1/folder/my_image.jpg
    // We need 'folder/my_image' (without extension usually, depending on resource type)

    // Re-using the logic from the previous controller which seemed robust enough for the existing URLs
    const urlParts = attachment.path.split("/");
    const publicIdWithExt = urlParts
      .slice(urlParts.indexOf("upload") + 2)
      .join("/");
    const publicId = publicIdWithExt.substring(
      0,
      publicIdWithExt.lastIndexOf(".")
    );

    // Delete from Cloudinary
    if (publicId) {
      await deleteFromCloudinary(publicId);
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
