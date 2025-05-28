import { Router, RequestHandler } from "express";
import {
  userListController,
  userCreateController,
  loginController,
  generateQRCodeController,
  enableMFAController,
  removeMFAController,
} from "../controllers/userController.js";
import verifyToken from "../middlewares/verifyToken.js";

const userRouter = Router();

userRouter.get("/", [verifyToken as RequestHandler], userListController);
userRouter.post("/", userCreateController);
userRouter.post("/login", loginController);
userRouter.post(
  "/generate-qr",
  [verifyToken as RequestHandler],
  generateQRCodeController
);
userRouter.put("/enable-mfa", [verifyToken as RequestHandler], enableMFAController);
userRouter.put("/remove-mfa", [verifyToken as RequestHandler], removeMFAController);

export default userRouter;
