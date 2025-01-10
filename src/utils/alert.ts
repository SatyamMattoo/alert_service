import { FailedRequest } from "../models/failedRequest";
import { sendAlertEmail } from "./mail";

const TIME_WINDOW = 10 * 60 * 1000;
const THRESHOLD = 5;
const MAX_REASONS = 100; // Maximum number of reasons to store

/**
 * Handles a failed request for a given IP address by logging the reason and timestamp.
 * 
 * The function checks if there is an existing record for the IP address. If no record is found,
 * it creates a new one with the current timestamp and reason. If a record exists, it increments
 * the failure count if the failure occurs within a specified time window, or resets it otherwise.
 * 
 * Reasons for failure are stored, with a limit on the maximum number of reasons. If the failure
 * count exceeds a defined threshold, an alert email is sent and the count is reset.
 * 
 * @param ip - The IP address of the failed request.
 * @param reason - The reason for the failed request.
 */

export async function handleFailedRequest(ip: string, reason: string) {
  try {
    const currentTime = new Date();
    let existingRecord = await FailedRequest.findOne({ ip });

    if (!existingRecord) {
      // Create a new record if none exists
      existingRecord = new FailedRequest({
        ip,
        reasons: [{ reason, timestamp: currentTime }],
        firstAttemptTime: currentTime,
        count: 1,
      });
    } else {
      const firstAttemptTime = existingRecord.firstAttemptTime ?? currentTime;
      const elapsedTime = currentTime.getTime() - firstAttemptTime.getTime();

      if (elapsedTime < TIME_WINDOW) {
        // Increment count if within the time window
        existingRecord.count++;
      } else {
        // Reset count if time window has passed
        existingRecord.count = 1;
        existingRecord.firstAttemptTime = currentTime;
      }

      // Append the new reason and timestamp
      existingRecord.reasons.push({ reason, timestamp: currentTime });

      // Ensure only the last 100 reasons are kept
      if (existingRecord.reasons.length > MAX_REASONS) {
        existingRecord.reasons = existingRecord.reasons.slice(-MAX_REASONS) as any;
      }

      // Check if threshold is reached
      if (existingRecord.count > THRESHOLD) {
        await sendAlertEmail(ip, existingRecord.count);
        existingRecord.count = 1; // Reset count after sending alert
      }
    }

    // Save or update the record
    await existingRecord.save();

    console.log(
      `Failed request logged: IP=${ip}, Reason=${reason}, Date=${new Date().toISOString().split("T")[0]}, Timestamp=${
        new Date().toISOString().split("T")[1].split(".")[0]
      }. Number of failed attempts since the last alert: ${existingRecord.count}`
    );
  } catch (error) {
    console.error("Error logging failed request:", error);
  }
}
