import { Request, Response } from "express";
import { prisma } from "../index";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp-random-originalName
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadAttachment = async (req: Request, res: Response) => {
  const { id } = req.params; // Ticket ID
  const { uploaderId } = req.body; // In real app, from auth token

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const attachment = await prisma.attachment.create({
      data: {
        filename: req.file.originalname,
        path: `/uploads/${req.file.filename}`, // Relative path for serving
        mimetype: req.file.mimetype,
        size: req.file.size,
        ticketId: id,
        uploaderId: uploaderId || "user-id-placeholder", // Fallback if not provided
      },
    });

    res.json(attachment);
  } catch (error) {
    console.error("Error uploading attachment:", error);
    res.status(500).json({ error: "Failed to upload attachment" });
  }
};
