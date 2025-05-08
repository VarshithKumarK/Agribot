import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import voiceRoutes from "./routes/voiceRoute.js";
import webhookRoutes from "./routes/webhookRoute.js";
import queryRoutes from "./routes/queryRoute.js";
import farmChatRoutes from "./routes/farmChatRoute.js";
import schemeRoutes from "./routes/schemeRoute.js";
const app = express();

app.use(cookieParser());
app.use(express.json());
// const allowedOrigin = 'http://192.168.139.50:5173';
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies)
  })
);

app.use("/api/voice", voiceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dialogflow", webhookRoutes);
app.use("/api/query", queryRoutes);
app.use("/api", farmChatRoutes);
app.use("/api/schemes", schemeRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log("Backend listening in port : ", PORT);
});
