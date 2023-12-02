import { Request, Response } from "express";
import { prisma } from "../../services/db";

export class UsersController {
  async getProfile(req: Request, res: Response) {
    const userId = req.userId as string;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user)
      return res.status(400).json({
        error: "Invalid user id",
      });

    res.json(user);
  }
}
