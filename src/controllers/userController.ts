import { PrismaClient } from "../../generated/prisma/index.js";
import { Request, Response } from "express";
const prisma = new PrismaClient();

type User = {

}

async function main(){
    const users = await prisma.user.findMany();
    return users;
}

export function userListController(req: Request, res: Response){
    let users: User[] | undefined = undefined;
    main()
    .then(async ()=>{

        await prisma.$disconnect();
    })

    .catch(async(e)=>{
        res.json({
            "users": []
        })
        console.log(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    res.json({
        "users": users
    })

}



