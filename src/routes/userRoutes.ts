import { Router } from "express";
import { userListController, userCreateController, loginController } from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/users", userListController);
userRouter.post("/users", userCreateController);
userRouter.post("/login", loginController);

export default userRouter;