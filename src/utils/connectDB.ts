import mongoose from "mongoose";

export const connectDB = () =>
  mongoose
    .connect(process.env.MONGODB_URI!, {
      dbName: "alerting"
    })
    .then((db) => console.log("Connected to MongoDB", db.connection.name))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
