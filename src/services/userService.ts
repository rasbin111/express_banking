import "dotenv/config";
import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();

export async function userByIdService(id: number){
  const user = await prisma.user.findUnique({
    where: {
      id: id
    }
  });
  return user;
}

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
    },
  });
  return user;
}

export async function userUpdateService(data: any) {
  await prisma.user.update({
    where: {
      id: parseInt(data.id),
    },
    data: {
      ...data
    },
  });
}

export function getMFACode({ email }: { email?: string }): {
  otpauthUrl: string;
  base32: string;
} {
  const secret = speakeasy.generateSecret({
    name: `${process.env.APP_NAME} | ${email}`,
    length: 20
  });
  return {
    otpauthUrl: secret.otpauth_url ?? "",
    base32: secret.base32,
  };
}

export const verifyMFACode = async (code: string, user: Prisma.UserCreateInput) => {
  console.log()
  if (user.secretMFA) {
    const codeValidity = speakeasy.totp.verify({
      secret: user.secretMFA,
      encoding: "base32",
      token: code,
      window: 2, // default 0, for security reasons 0 is the best
    });
    return codeValidity
  } else {
    return false
  }
};
