// src/app.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use('/uploads', express.static('uploads'));

export default app;
