import { Router } from "express";
import { userListController } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/users", userListController);

export default userRouter;