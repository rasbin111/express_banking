import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/index.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { error } from "console";

const prisma = new PrismaClient();

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const SECRET = process.env.SECRET || "DEFUALT_SECRET";

  let token =
    req.headers["x-access-token"] &&
    (typeof req.headers["x-access-token"] === "string"
      ? req.headers["x-access-token"]
      : req.headers["x-access-token"][0]);
  if (!token) {
    return res.status(403).json({
      auth: false,
      message: "No token provided",
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({
        auth: false,
        message: `Failed to authenticate: ${err}`,
      });
    }

    const { id } = decoded;
    console.log(id);
    req.currentUserId = id;

    prisma.user
      .findUnique({
        where: { id: id },
      })
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        return res.status(400).json({
          auth: false,
          message: `Failed to authenticate: ${err}`,
        });
      });
  });
}
