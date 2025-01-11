// kafkaProducer.ts
import { KafkaClient, Producer } from "kafka-node";
import { sslOptions } from "../config/sslOptions";
import envs from "../config/envconfig";

const client = new KafkaClient({
  kafkaHost: envs.KAFKA_HOST,
  sslOptions: sslOptions,
});

const producer = new Producer(client);

producer.on("ready", () => {
  console.log("Kafka Producer is connected.");
});

producer.on("error", (error) => {
  console.error("Kafka Producer error:", error);
});

/**
 * Sends a failed request message to Kafka.
 * @param {string} message - The message to be sent to Kafka.
 */
export const sendFailedRequestToKafka = (message: string) => {
  const payloads = [
    { topic: "failed-requests", messages: message},
  ];
  producer.send(payloads, (err, data) => {
    if (err) console.error("Error sending message to Kafka:", err);
    else console.log("Message sent to Kafka:", data);
  });
};
