import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export default function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token || !/[Bb]earer /.test(token.slice(0, 7)))
    return res.status(401).json({
      errro: "Unauthorized",
    });

  const decoded = verify(token.slice(7), JWT_SECRET);

  if (!decoded)
    return res.status(401).json({
      errro: "Unauthorized",
    });

  req.userId = (decoded as JwtPayload).userId;

  next();
}
