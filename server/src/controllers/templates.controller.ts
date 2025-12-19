import { Request, Response } from "express";
import { prisma } from "../index";

// Get all ticket templates (for Service Catalog)
export const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await prisma.ticketTemplate.findMany({
      orderBy: {
        category: "asc",
      },
    });
    res.json(templates);
  } catch (error) {
    console.error("Error fetching ticket templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

// Get single template
export const getTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const template = await prisma.ticketTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ error: "Failed to fetch template" });
  }
};
