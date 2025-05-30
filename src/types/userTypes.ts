import {Request} from "express";
import { JwtPayload } from "jsonwebtoken";


type Profile = {
    id: number;
    bio: string;
    userId: number;
    user: User;
}

export type User = {
    id: number;
    email: string;
    name?: string;
    password?: string;
    isMFAEnabled: boolean;
    secretMFA?: string;
    // profile?: Profile;

}

export interface RequestWithUser extends Request{
    user: User;
    currentUserId?: number;
}

export interface UserJwtPayload extends JwtPayload {
    id: string;
}
