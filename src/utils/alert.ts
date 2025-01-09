import { FailedRequest } from "../models/failedRequest";
import { sendAlertEmail } from "./mail";

const TIME_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds
const THRESHOLD = 5;

export async function handleFailedRequest(ip: string, reason: string) {
  const currentTime = new Date();
  let existingRecord = await FailedRequest.findOne({ ip });

  if (!existingRecord) {
    // Create a new record if none exists
    existingRecord = new FailedRequest({
      ip,
      reason,
      firstAttemptTime: currentTime,
      count: 1,
    });
  } else {
    // Check if firstAttemptTime is valid
    const firstAttemptTime = existingRecord.firstAttemptTime ?? currentTime;
    const elapsedTime = currentTime.getTime() - firstAttemptTime.getTime();

    if (elapsedTime < TIME_WINDOW) {
      existingRecord.count++;
    } else {
      existingRecord.count = 1;
      existingRecord.firstAttemptTime = currentTime;
    }

    if (existingRecord.count >= THRESHOLD) {
      await sendAlertEmail(ip, existingRecord.count);
      existingRecord.count = 0; // Reset count after alert
    }
  }

  await existingRecord.save(); // Save or update the record

  // Log the failed request
  await logFailedRequest(ip, reason);
}

async function logFailedRequest(ip: string, reason: string) {
  try {
    console.log(
      `Failed request logged: IP=${ip}, Reason=${reason}, Timestamp=${new Date().toISOString()}`
    );

    // Save the failed request details to the database
    const failedRequest = new FailedRequest({ ip, reason });
    await failedRequest.save();

    console.log("Failed request details saved to the database.");
  } catch (error) {
    console.error("Error logging failed request:", error);
  }
}
