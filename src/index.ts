import express, { Express } from "express";
import submitRouter from "./routes/submit";
import { connectDB } from "./utils/connectDB";
import requestsRouter from "./routes/requests";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { kafkaConsumer } from "./utils/kafkaConsumer";

dotenv.config();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

// Create Express app
export const app: Express = express();

// Connect to MongoDB
connectDB();

// Start Kafka consumer
kafkaConsumer.client.connect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

//Routes
app.use("/api/v1/submit", submitRouter);
app.use("/api/v1/requests", requestsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
