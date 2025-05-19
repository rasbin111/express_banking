import { Router, RequestHandler } from "express";
import { userListController, userCreateController, loginController, generateQRCode, enableMFA } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
const userRouter = Router();

userRouter.get("/users", [verifyToken as RequestHandler], userListController);
userRouter.post("/users", userCreateController);
userRouter.post("/login", loginController);
userRouter.post("/generate-qr", [verifyToken as RequestHandler], generateQRCode);
userRouter.post("/enable-mfa", [verifyToken as RequestHandler], enableMFA);

export default userRouter;