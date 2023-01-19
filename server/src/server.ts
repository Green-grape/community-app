import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth";
import subRouter from "./routes/subs";
import postRouter from "./routes/post";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.static("public"));
app.use(express.json()); //json 데이터 해석
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRouter);
app.use("/api/subs", subRouter);
app.use("/api/posts", postRouter);

const port = process.env.PORT || 5501;
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log("Database connected to Server");
    })
    .catch((error) => console.log(error));
});
