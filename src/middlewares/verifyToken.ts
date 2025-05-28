import "dotenv/config";
import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestWithUser, UserJwtPayload } from "../types/userTypes.js";

const prisma = new PrismaClient();

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

        prisma.user
            .findUnique({
                where: { id: parseInt(id) },
            })
            .then((user) => {
                if (user) {
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
