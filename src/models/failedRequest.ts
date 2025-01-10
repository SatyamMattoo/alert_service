import mongoose from "mongoose";

const failedRequestSchema = new mongoose.Schema({
  ip: String,
  reasons: [
    {
      reason: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  firstAttemptTime: { type: Date, default: null },
  currentAttempttime: { type: Date, default: Date.now },
  count: { type: Number, default: 1 },
});

export const FailedRequest = mongoose.model(
  "FailedRequest",
  failedRequestSchema
);
