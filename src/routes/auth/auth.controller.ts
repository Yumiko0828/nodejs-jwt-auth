import { Request, Response } from "express";
import { prisma } from "../../services/db";
import { compareSync, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

export class AuthController {
  async signup(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({
        error: "Missing credentials",
      });

    try {
      const existUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              username,
            },
            {
              email,
            },
          ],
        },
      });

      if (existUser)
        return res.json({
          error: "Credentials taken",
        });

      console.log(password);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: await hash(password, await genSalt(10)),
        },
      });

      const token = sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token,
      });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  }

  async signin(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !compareSync(password, user.password))
        return res.json({
          error: "Invalid credentials",
        });

      const token = sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token,
      });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  }
}
