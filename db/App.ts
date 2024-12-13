import https from "https";
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import indexRouter from "./routes/Index";
dotenv.config();

const app = express();
app.use(
  cors({
    /*
    origin: "https://mychristmastreeletter.com",
    credentials: true,
  */
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello world!" });
});

const mongoURI = process.env.MONGODB_URL;
if (!mongoURI) {
  throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoose connected."))
  .catch(() => console.log("failed."));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server on at ${PORT}`));
