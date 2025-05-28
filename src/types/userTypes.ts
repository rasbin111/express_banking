import {Request} from "express";
import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";

type Profile = {
    id: number;
    bio: string;
    userId: number;
    user: User;
}

type User = {
    id: number;
    email: string;
    name?: string;
    password?: string;
    isMFAEnabled: boolean;
    secretMFA?: string;
    profile?: Profile;

}

export interface RequestWithUser extends Request{
    user: Prisma.UserWhereUniqueInput;
    currentUserId?: number;
}

export interface UserJwtPayload extends JwtPayload {
    id: string;
}
