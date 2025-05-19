import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import userRouter from "./routes/userRoutes.js";
import helmet from "helmet";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
}));

// should enable it for security 
app.use(helmet());

app.use(express.json());

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

app.use("/static", express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/", userRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
