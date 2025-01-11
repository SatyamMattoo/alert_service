import { FailedRequest } from "../models/failedRequest";
import { sendFailedRequestToKafka } from "./kafkaProducer";
import { sendAlertEmail } from "./mail";

const TIME_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds
const THRESHOLD = 5;
const MAX_REASONS = 100; // Maximum number of reasons to store

/**
 * Processes a failed request by updating the corresponding database record.
 * If the request's timestamp is within the time window, increments the count.
 * If the time window has passed, resets the count.
 * Appends the new reason and timestamp to the record.
 * Ensures only the last 100 reasons are kept.
 * Checks if the threshold is reached and sends an alert email if so.
 * Saves or updates the record.
 * @param {Object} data - An object with the following properties:
 *   - {string} ip - The IP address of the user making the request.
 *   - {string} reason - The reason for the failed request.
 *   - {Date} timestamp - The timestamp of the failed request.
 */
export async function processFailedRequest(data: {
  ip: string;
  reason: string;
  timestamp: Date;
}) {
  try {
    const { ip, reason, timestamp } = data;
    let existingRecord = await FailedRequest.findOne({ ip });
    if (!existingRecord) {
      // Create a new record if none exists
      existingRecord = new FailedRequest({
        ip,
        reasons: [{ reason, timestamp }],
        firstAttemptTime: timestamp,
        count: 1,
      });
    } else {
      const firstAttemptTime = existingRecord.firstAttemptTime ?? timestamp;
      const elapsedTime = timestamp.getTime() - firstAttemptTime.getTime();

      if (elapsedTime < TIME_WINDOW) {
        // Increment count if within the time window
        existingRecord.count++;
      } else {
        // Reset count if time window has passed
        existingRecord.count = 1;
        existingRecord.firstAttemptTime = timestamp;
      }

      // Append the new reason and timestamp
      existingRecord.reasons.push({ reason, timestamp });

      // Ensure only the last 100 reasons are kept
      if (existingRecord.reasons.length > MAX_REASONS) {
        existingRecord.reasons = existingRecord.reasons.slice(
          -MAX_REASONS
        ) as any;
      }

      // Check if threshold is reached
      if (existingRecord.count > THRESHOLD) {
        await sendAlertEmail(ip, existingRecord.count);
        existingRecord.count = 1;
      }
    }

    // Save or update the record
    await existingRecord.save();

    console.log(
      `Processed failed request: IP=${ip}, Reason=${reason}, Timestamp=${
        timestamp.toISOString().split("T")[0]
      } ${timestamp.toISOString().split("T")[1].split(".")[0]}. Failed attempts in the time window=${
        existingRecord.count
      }`
    );
  } catch (error) {
    console.error("Error processing failed request:", error);
  }
}

/**
 * Handles a failed request by sending a message to the Kafka topic "failed-requests"
 * with the IP address, reason, and current timestamp.
 * @param {string} ip - The IP address of the user making the request.
 * @param {string} reason - The reason for the failed request.
 */
export async function handleFailedRequest(ip: string, reason: string) {
  try {
    const currentTime = new Date();
    const message = JSON.stringify({ ip, reason, timestamp: currentTime });
    sendFailedRequestToKafka(message);
    console.log(`Failed request sent to Kafka: IP=${ip}, Reason=${reason}`);
  } catch (error) {
    console.error("Error sending failed request to Kafka:", error);
  }
}
