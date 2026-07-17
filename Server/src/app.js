import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/authRoutes.js"
import tempRoomRoutes from "./Routes/tempRoomRoutes.js"
import persistentRoomRoutes from "./Routes/persistentRoomRoutes.js";

const app = express();

const FRONTEND_URI = (process.env.FRONTEND_URI || "").replace(/\/$/, "");

app.use(cors({
    origin:FRONTEND_URI,
    credentials:true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/temp-room",tempRoomRoutes);
app.use("/api/rooms",persistentRoomRoutes);

export default app;
