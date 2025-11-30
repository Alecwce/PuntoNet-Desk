import { Request, Response } from "express";
import { prisma } from "../index";

export const getArticles = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    const where = search
      ? {
          OR: [
            {
              title: { contains: String(search), mode: "insensitive" as const },
            },
            {
              content: {
                contains: String(search),
                mode: "insensitive" as const,
              },
            },
            { tags: { has: String(search) } },
          ],
        }
      : {};

    const articles = await prisma.knowledgeBase.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  const { title, content, tags } = req.body;
  try {
    const article = await prisma.knowledgeBase.create({
      data: {
        title,
        content,
        tags: tags || [],
      },
    });
    res.json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.knowledgeBase.delete({
      where: { id },
    });
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
};
