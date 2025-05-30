import { Router } from "express";
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

userRouter.get("/", [verifyToken], userListController);
userRouter.post("/", userCreateController);
userRouter.post("/login", loginController);
userRouter.post(
  "/generate-qr",
  [verifyToken],
  generateQRCodeController
);
userRouter.put("/enable-mfa", [verifyToken], enableMFAController);
userRouter.put("/remove-mfa", [verifyToken], removeMFAController);

export default userRouter;
