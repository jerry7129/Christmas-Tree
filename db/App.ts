import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import indexRouter from "./routes/Index";
dotenv.config();

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);

const mongoURI = process.env.MONGODB_LOCAL;
if (!mongoURI) {
  throw new Error("MONGODB_LOCAL 환경 변수가 설정되지 않았습니다.");
}

mongoose
  .connect(
    //`mongodb+srv://${DB_ID}:${DB_PASSWORD}@${DB_NAME}.b3ebp.mongodb.net/`*/
    mongoURI
  )
  .then(() => console.log("mongoose connected."))
  .catch(() => console.log("failed."));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server on at ${PORT}`));
