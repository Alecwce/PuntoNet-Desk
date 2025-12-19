import { Request, Response } from "express";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";

export const getArticles = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    const where: Prisma.KnowledgeBaseWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        {
          title: { contains: String(search), mode: "insensitive" as const },
        },
        {
          content: {
            contains: String(search),
            mode: "insensitive" as const,
          },
        },
      ];
    }

    const articles = await prisma.knowledgeBase.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  const { title, content, status, authorId } = req.body;
  try {
    const article = await prisma.knowledgeBase.create({
      data: {
        title,
        content,
        status: status || "PUBLISHED",
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
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

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await prisma.knowledgeBase.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  try {
    const article = await prisma.knowledgeBase.update({
      where: { id },
      data: {
        title,
        content,
        status,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    res.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
};

export const incrementViews = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.knowledgeBase.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    res.json({ message: "View incremented" });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ error: "Failed to increment views" });
  }
};
