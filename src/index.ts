import express, { Express } from "express";
import submitRouter from "./routes/submit";
import { connectDB } from "./utils/connectDB";
import requestsRouter from "./routes/requests";
import { monitorMiddleware } from "./middleware/alertMiddleware";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;

export const app: Express = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(monitorMiddleware);

//Routes
app.get("/api/v1/submit", submitRouter);
app.get("/api/v1/requests", requestsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
