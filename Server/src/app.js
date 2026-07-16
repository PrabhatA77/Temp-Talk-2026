import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/authRoutes.js"
import tempRoomRoutes from "./Routes/tempRoomRoutes.js"
import persistentRoomRoutes from "./Routes/persistentRoomRoutes.js";

const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/temp-room",tempRoomRoutes);
app.use("/api/rooms",persistentRoomRoutes);

export default app;
