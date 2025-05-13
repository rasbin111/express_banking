import "dotenv/config"
import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { userListService, userCreateService, loginService } from "../services/userService.js";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export function userListController(req: Request, res: Response) {
  userListService()
    .then(async (users) => {
      res.json({
        users: users,
      });
      await prisma.$disconnect();
    })

    .catch(async (e) => {
      res.json({
        users: [],
      });
      console.log(e);
      await prisma.$disconnect();
      process.exit(1);
    });
  // res.json({
  //     "users": users
  // })
}

export async function userCreateController(req: Request, res: Response) {
  const userInfo = await req.body;
  const SECRET = process.env.SECRET || "DEFAULT_SECRET";
  const hashedPassword = await bcrypt.hash(SECRET, 10);
  userInfo["password"] = hashedPassword;
  userCreateService(userInfo)
    .then((user) => {
      res.status(200).json({
        message: "User created Successfully",
        user: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
}

export async function loginController(req: Request, res: Response){
    loginService(req.body.email)
    .then((user)=>{
    const SECRET = process.env.SECRET || "DEFAULT_SECRET"
    if (!user){
      return res.status(400).json({error: "No user found"})
    } 

    let passwordIsValid = bcrypt.compare(user.password, req.body.password);

    if (!passwordIsValid){
      return res.status(401).json({auth: false, token: null})
    }
    let token = jwt.sign({id: user.id}, SECRET, {
      expiresIn: 1 * 86400 // one day
    })
    return res.status(200).json({
      auth: true,
      token: token, 
      expiresIn: 86400
    })
  })
  .catch(err=>{
    return res.status(400).json({
      "err": err
    })
  })
}
