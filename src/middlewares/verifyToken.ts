import "dotenv/config";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser, User, UserJwtPayload } from "../types/userTypes.js";
import { userByIdService } from "../services/userService.js";

export default function verifyToken(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const SECRET = process.env.SECRET || "DEFUALTSECRET";

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
    req.currentUserId = parseInt(id);

    userByIdService(parseInt(id))
      .then((user: User) => {
        if (user) {
          req.user = user as RequestWithUser["user"];
          next();
        }
      })
      .catch((err: Error) => {
        return res.status(400).json({
          auth: false,
          message: `Failed to authenticate: ${err}`,
        });
      });
  });
}
