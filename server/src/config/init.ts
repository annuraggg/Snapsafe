import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import "./mongoose.js"

const app = express();

dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

export default app;
