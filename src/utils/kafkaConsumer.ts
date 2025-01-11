// kafkaConsumer.ts
import { Consumer, KafkaClient, ConsumerOptions } from "kafka-node";
import { processFailedRequest } from "./alert";
import { sslOptions } from "./sslOptions";
import envs from "../config/envconfig";

const createKafkaConsumer = () => {
  const client = new KafkaClient({
    kafkaHost: envs.KAFKA_HOST,
    sslOptions: sslOptions,
    connectTimeout: 10000, // 10 seconds
    requestTimeout: 30000, // 30 seconds
  });

  // Configure consumer options
  const options: ConsumerOptions = {
    autoCommit: true,
    groupId: "failed-requests-group",
    encoding: "utf8",
  };

  // Create consumer with specific topic configuration
  const consumer = new Consumer(
    client,
    [
      {
        topic: "failed-requests",
        partition: 0, // Explicitly specify partition
      },
    ],
    options
  );

  // Enhanced error handling and logging
  consumer.on("message", async (message) => {
    try {
      const requestData = JSON.parse(message.value as string);

      const { ip, reason, timestamp } = requestData;
      if (!ip || !reason || !timestamp) {
        throw new Error(
          `Invalid message format: ${JSON.stringify(requestData)}`
        );
      }

      await processFailedRequest({
        ip,
        reason,
        timestamp: new Date(timestamp),
      });

      // Add message to the batch
      // batch.push({ ip, reason, timestamp: new Date(timestamp) });

      // // If batch size exceeds the limit, process the batch
      // if (batch.length >= BATCH_SIZE) {
      //   await processBatch(batch);
      //   batch.length = 0; // Clear the batch after processing
      // }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  consumer.on("error", (error) => {
    console.error("Consumer error:", error);
  });

  consumer.on("offsetOutOfRange", (error) => {
    console.error("Offset out of range:", error);
  });

  // Additional event handlers for better monitoring
  client.on("ready", () => {
    console.log("Kafka Client is connected.");
  });

  client.on("error", (error) => {
    console.error("Kafka client error:", error);
  });

  return consumer;
};

// Export consumer instance
export const kafkaConsumer = createKafkaConsumer();
