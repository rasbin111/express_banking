import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();

export async function userListService() {
  const users = await prisma.user.findMany();
  return users;
}

export async function userCreateService(userInfo: Prisma.UserCreateInput) {
  const user = await prisma.user.create({
    data: userInfo,
  });
  const {password, ...userWithoutPassword} = user;
  return userWithoutPassword;
}

export async function loginService(email: string){
    const user = await prisma.user.findUnique({
        where:{
            email: email,
        }
    })
    return user;
}