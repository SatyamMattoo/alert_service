import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database using the URI specified in the environment variable `MONGODB_URI`.
 * Logs a success message with the connected database name if the connection is successful.
 * Logs an error message if the connection fails.
 */

export const connectDB = () =>
  mongoose
    .connect(process.env.MONGODB_URI!, {
      dbName: "alerting"
    })
    .then((db) => console.log("Connected to MongoDB with database:", db.connection.name))
    .catch((err) => console.error("Failed to connect to MongoDB", err));
