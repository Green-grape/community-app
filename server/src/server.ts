import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json()); //json 데이터 해석
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.get("/", (_, res) => res.send("running"));
app.use("/api/auth", authRouter);
app.use("/api/subs");

const port = process.env.PORT || 5501;
app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);

  AppDataSource.initialize()
    .then(async () => {
      console.log("Database connected to Server");
    })
    .catch((error) => console.log(error));
});
