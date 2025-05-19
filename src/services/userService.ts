import "dotenv/config";
import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
import speakeasy from "speakeasy";


export async function userListService() {
    const users = await prisma.user.findMany();
    return users;
}

export async function userCreateService(userInfo: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
        data: userInfo,
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function loginService(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
    return user;
}

export function userUpdateService(data: any) {
    prisma.user.update({
        where: {
            id: parseInt(data.id)
        },
        data: {
            ...data
        }
    })

}

export function getTwoFactorAuthenticationCode({ email }: { email?: string }): { otpauthUrl: string, base32: string } {
    const secret = speakeasy.generateSecret({
        name: `${process.env.APP_NAME} | ${email}`
})
    return {
        otpauthUrl: secret.otpauth_url??"",
        base32: secret.base32
    };
}
