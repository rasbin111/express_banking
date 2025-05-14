import { Router, RequestHandler } from "express";
import { userListController, userCreateController, loginController } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
const userRouter = Router();

userRouter.get("/users", [verifyToken as RequestHandler], userListController);
userRouter.post("/users", userCreateController);
userRouter.post("/login", loginController);

export default userRouter;