import mongoose from "mongoose";

const failedRequestSchema = new mongoose.Schema({
  ip: String,
  reason: String,
  firstAttemptTime: { type: Date, default: null },
  count: { type: Number, default: 0 },
});

export const FailedRequest = mongoose.model(
  "FailedRequest",
  failedRequestSchema
);
