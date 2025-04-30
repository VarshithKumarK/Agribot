import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import voiceRoutes from "./routes/voiceRoute.js"
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads",express.static('uploads'));
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow credentials (cookies)
  })
);

app.use('/api/voice',voiceRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log("Backend listening in port : ", PORT);
});
