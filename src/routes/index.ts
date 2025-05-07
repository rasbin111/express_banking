import { Router } from "express";
import { HomePage } from "../controllers/homeController.js";

const indexRouter = Router();

indexRouter.get("/", HomePage)

export default indexRouter;