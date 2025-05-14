import "dotenv/config";
import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { error } from "console";

const prisma = new PrismaClient();

interface UserJwtPayload extends JwtPayload{
  id: string;
}

interface UserRequest extends Request{
  currentUserId: string;
  user: Prisma.UserCreateInput;
}

export default function verifyToken(
  req: UserRequest,
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

    const { id } = decoded as UserJwtPayload;
    console.log(id);
    req.currentUserId = id;

    prisma.user
      .findUnique({
        where: { id: parseInt(id) },
      })
      .then((user) => {
        if (user){
          req.user = user;
          next();
        }
      })
      .catch((err) => {
        return res.status(400).json({
          auth: false,
          message: `Failed to authenticate: ${err}`,
        });
      });
  });
}
