import { Router, RequestHandler } from "express";
import { userListController, userCreateController, loginController, generateQRCodeController, enableMFAController } from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";
const userRouter = Router();

userRouter.get("/", [verifyToken as RequestHandler], userListController);
userRouter.post("/", userCreateController);
userRouter.post("/login", loginController);
userRouter.post("/generate-qr", [verifyToken as RequestHandler], generateQRCodeController);
userRouter.post("/enable-mfa", [verifyToken], enableMFAController);

export default userRouter;